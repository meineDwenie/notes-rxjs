import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, filter, tap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { Notebook } from '../../../notebooks/notebook.model';
import { Note } from '../../../notes/note.model';
import * as NotebookSelectors from '../../../notebooks/notebook.selectors';
import * as NoteSelectors from '../../../notes/note.selectors';
import * as NotebookActions from '../../../notebooks/notebook.actions';
import * as NoteActions from '../../../notes/note.actions';
import { NoteComponent } from '../../note/note';
import { ButtonFeatureComponent } from '../../shared/button-feature/button-feature';
import { EventBusService } from '../../../services/event-bus.service';

@Component({
  selector: 'app-notebook-detail',
  standalone: true,
  imports: [CommonModule, NoteComponent, ButtonFeatureComponent],
  templateUrl: './notebook-detail.html',
  styleUrl: './notebook-detail.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotebookDetail implements OnInit, OnDestroy {
  notebook$!: Observable<Notebook | undefined>;
  allNotes$!: Observable<Note[]>;
  searchTerm$!: Observable<string>;

  // Add observables for pinned and unpinned notes within the notebook (filtered by search)
  pinnedNotesInNotebook$!: Observable<Note[]>;
  unpinnedNotesInNotebook$!: Observable<Note[]>;
  hasPinnedNotesInNotebook$!: Observable<boolean>;
  hasUnpinnedNotesInNotebook$!: Observable<boolean>;

  notFound = false;
  openNotebookOptionsId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private eventBus: EventBusService
  ) {}

  ngOnInit() {
    this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
    this.searchTerm$ = this.store.select(NoteSelectors.selectSearchTerm);

    this.notebook$ = combineLatest([
      this.route.params,
      this.store.select(NotebookSelectors.selectAllNotebooks),
      this.allNotes$,
    ]).pipe(
      map(([params, notebooks, allNotes]) => {
        const notebook = notebooks.find((nb) => nb.id === params['id']);

        if (!notebook && notebooks.length > 0) {
          this.notFound = true;
          return undefined;
        }

        if (!notebook) return undefined;

        // The key fix: properly sync notebook notes with the latest note data
        const updatedNotes = notebook.notes
          .map((notebookNote) => {
            // Find the latest version of each note from allNotes
            const latestNote = allNotes.find((n) => n.id === notebookNote.id);
            return latestNote || notebookNote; // Use latest version if found, otherwise use notebook version
          })
          .filter((note): note is Note => !!note); // Remove any null/undefined notes

        return {
          ...notebook,
          notes: updatedNotes,
        };
      }),
      tap((notebook) => {
        // Debug logging
        if (notebook) {
          console.log('Final notebook with notes:', notebook.notes.length);
        }
      }),
      takeUntil(this.destroy$)
    );

    // Create observables for filtered notes within the notebook
    const filteredNotebookNotes$ = combineLatest([
      this.notebook$,
      this.searchTerm$,
    ]).pipe(
      map(([notebook, searchTerm]) => {
        if (!notebook) return [];

        // If no search term, return all notes
        if (!searchTerm.trim()) {
          return notebook.notes;
        }

        // Filter notes based on search term
        return notebook.notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );

    // Create observables for pinned and unpinned notes within the notebook (with search filtering)
    this.pinnedNotesInNotebook$ = filteredNotebookNotes$.pipe(
      map((notes) => notes.filter((note) => note.pinned))
    );

    this.unpinnedNotesInNotebook$ = filteredNotebookNotes$.pipe(
      map((notes) => notes.filter((note) => !note.pinned))
    );

    this.hasPinnedNotesInNotebook$ = this.pinnedNotesInNotebook$.pipe(
      map((notes) => notes.length > 0)
    );

    this.hasUnpinnedNotesInNotebook$ = this.unpinnedNotesInNotebook$.pipe(
      map((notes) => notes.length > 0)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByNoteId(index: number, note: Note): string {
    return note.id;
  }

  editNotebook(notebook: Notebook) {
    this.startEditingNotebook(notebook);
  }

  // Start editing notebook
  startEditingNotebook(notebook: Notebook): void {
    this.openNotebookOptionsId = null;
    this.eventBus.emitNotebookEdit(notebook);
  }

  deleteNotebook(notebook: Notebook) {
    if (confirm(`Are you sure you want to delete "${notebook.name}"?`)) {
      this.store.dispatch(NotebookActions.deleteNotebook({ id: notebook.id }));
      // Navigate back to main view after deletion
      this.router.navigate(['/']);
    }
  }

  openNote(note: Note) {
    this.eventBus.emitNoteSelected(note);
  }

  removeNoteFromNotebook(noteId: string) {
    if (confirm('Remove this note from the notebook?')) {
      this.notebook$
        .pipe(
          filter((notebook) => !!notebook),
          take(1)
        )
        .subscribe((notebook) => {
          if (notebook) {
            const updatedNotes = notebook.notes.filter(
              (note) => note.id !== noteId
            );

            this.store.dispatch(
              NotebookActions.updateNotebook({
                update: {
                  id: notebook.id,
                  changes: {
                    notes: updatedNotes,
                  },
                },
              })
            );
          }
        });
    }
  }

  deleteNote(noteId: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      // First remove from notebook
      this.removeNoteFromNotebook(noteId);
      // Then delete the note entirely
      this.store.dispatch(NoteActions.deleteNote({ id: noteId }));
    }
  }

  togglePin(note: Note, event: MouseEvent) {
    event.stopPropagation();

    // Update the note's pin status in the main notes store
    this.store.dispatch(NoteActions.togglePinNote({ id: note.id }));

    // Update the notebook to reflect the pinned status change
    this.notebook$
      .pipe(
        filter((notebook) => !!notebook),
        take(1)
      )
      .subscribe((notebook) => {
        if (notebook) {
          const updatedNotes = notebook.notes.map((n) =>
            n.id === note.id ? { ...n, pinned: !n.pinned } : n
          );

          this.store.dispatch(
            NotebookActions.updateNotebook({
              update: {
                id: notebook.id,
                changes: {
                  notes: updatedNotes,
                },
              },
            })
          );
        }
      });
  }

  handleNoteOption(action: string, note: Note) {
    console.log('Note option selected:', action, note.title);

    switch (action) {
      case 'removeFromNotebook':
        this.removeNoteFromNotebook(note.id);
        break;
      case 'delete':
        this.deleteNote(note.id);
        break;
      case 'addToNotebook':
        this.eventBus.triggerAddToNotebookModal(note);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}
