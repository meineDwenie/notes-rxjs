import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { Note } from '../../../notes/note.model';
import * as NoteSelectors from '../../../notes/note.selectors';
import * as NoteActions from '../../../notes/note.actions';
import { NoteComponent } from '../../note/note';

@Component({
  selector: 'app-archive-view',
  imports: [],
  templateUrl: './archive-view.html',
  styleUrl: './archive-view.css',
})
export class ArchiveView implements OnInit, OnDestroy {
  allNotes$!: Observable<Note[]>;
  searchTerm$!: Observable<string>;

  // Archive-specific observables
  archivedNotes$!: Observable<Note[]>;
  filteredArchivedNotes$!: Observable<Note[]>;
  pinnedArchivedNotes$!: Observable<Note[]>;
  unpinnedArchivedNotes$!: Observable<Note[]>;

  // Boolean observables
  hasArchivedNotes$!: Observable<boolean>;
  hasPinnedArchivedNotes$!: Observable<boolean>;
  hasUnpinnedArchivedNotes$!: Observable<boolean>;
  hasSearchResults$!: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
    this.searchTerm$ = this.store.select(NoteSelectors.selectSearchTerm);

    // Get all archived notes (assuming you add an 'archived' property to Note model)
    this.archivedNotes$ = this.allNotes$.pipe(
      map((notes) => notes.filter((note) => note.archived === true)),
      takeUntil(this.destroy$)
    );

    // Filter archived notes based on search term
    this.filteredArchivedNotes$ = combineLatest([
      this.archivedNotes$,
      this.searchTerm$,
    ]).pipe(
      map(([archivedNotes, searchTerm]) => {
        if (!searchTerm.trim()) {
          return archivedNotes;
        }

        return archivedNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      takeUntil(this.destroy$)
    );

    // Separate pinned and unpinned archived notes
    this.pinnedArchivedNotes$ = this.filteredArchivedNotes$.pipe(
      map((notes) => notes.filter((note) => note.pinned))
    );

    this.unpinnedArchivedNotes$ = this.filteredArchivedNotes$.pipe(
      map((notes) => notes.filter((note) => !note.pinned))
    );

    // Boolean observables for template conditions
    this.hasArchivedNotes$ = this.archivedNotes$.pipe(
      map((notes) => notes.length > 0)
    );

    this.hasPinnedArchivedNotes$ = this.pinnedArchivedNotes$.pipe(
      map((notes) => notes.length > 0)
    );

    this.hasUnpinnedArchivedNotes$ = this.unpinnedArchivedNotes$.pipe(
      map((notes) => notes.length > 0)
    );

    this.hasSearchResults$ = this.filteredArchivedNotes$.pipe(
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

  restoreNote(note: Note) {
    if (confirm('Restore this note from archive?')) {
      this.store.dispatch(
        NoteActions.updateNote({
          update: {
            id: note.id,
            changes: { archived: false },
          },
        })
      );
    }
  }

  deleteNote(noteId: string) {
    if (confirm('Permanently delete this note?')) {
      this.store.dispatch(NoteActions.deleteNote({ id: noteId }));
    }
  }

  togglePin(note: Note, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(NoteActions.togglePinNote({ id: note.id }));
  }
}
