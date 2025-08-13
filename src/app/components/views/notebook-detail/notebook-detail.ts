import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, Subject, pipe } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { Notebook } from '../../../notebooks/notebook.model';
import { Note } from '../../../notes/note.model';
import * as NotebookSelectors from '../../../notebooks/notebook.selectors';
import * as NotebookActions from '../../../notebooks/notebook.actions';
import * as NoteActions from '../../../notes/note.actions';
import { NoteComponent } from '../../note/note';
import { ButtonMainComponent } from '../../shared/button-main/button-main';

@Component({
  selector: 'app-notebook-detail',
  standalone: true,
  imports: [CommonModule, NoteComponent, ButtonMainComponent],
  templateUrl: './notebook-detail.html',
  styleUrl: './notebook-detail.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotebookDetail implements OnInit, OnDestroy {
  notebook$!: Observable<Notebook | undefined>;
  notFound = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.notebook$ = combineLatest([
      this.route.params,
      this.store.select(NotebookSelectors.selectAllNotebooks),
    ]).pipe(
      map(([params, notebooks]) => {
        const notebook = notebooks.find((nb) => nb.id === params['id']);
        if (!notebook && notebooks.length > 0) {
          this.notFound = true;
        }
        return notebook;
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByNoteId(index: number, note: Note): string {
    return note.id;
  }

  goBack() {
    this.router.navigate(['/notebooks']);
  }

  editNotebook(notebook: Notebook) {
    // Emit event to open edit modal
    // You can use your EventBusService here
  }

  deleteNotebook(notebook: Notebook) {
    if (confirm(`Are you sure you want to delete "${notebook.name}"?`)) {
      this.store.dispatch(NotebookActions.deleteNotebook({ id: notebook.id }));
      this.goBack();
    }
  }

  addNoteToNotebook() {
    // Open modal to select existing note or create new one
    // You can use your EventBusService here
  }

  openNote(note: Note) {
    // Open note modal
  }

  removeNoteFromNotebook(noteId: string) {
    this.notebook$
      .pipe(
        filter((notebook) => !!notebook),
        takeUntil(this.destroy$)
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
                changes: { notes: updatedNotes },
              },
            })
          );
        }
      });
  }

  togglePin(note: Note, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(NoteActions.togglePinNote({ id: note.id }));
  }

  handleNoteOption(action: string, note: Note) {
    switch (action) {
      case 'removeFromNotebook':
        this.removeNoteFromNotebook(note.id);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this note?')) {
          this.store.dispatch(NoteActions.deleteNote({ id: note.id }));
        }
        break;
    }
  }
}
