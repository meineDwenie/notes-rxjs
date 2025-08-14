import {
  Component,
  Output,
  EventEmitter,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { EventBusService } from '../../../../services/event-bus.service';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Note } from '../../../../notes/note.model';
import { Notebook } from '../../../../notebooks/notebook.model';
import * as NoteSelectors from '../../../../notes/note.selectors';
import * as NotebookSelectors from '../../../../notebooks/notebook.selectors';
import * as NoteActions from '../../../../notes/note.actions';
import * as NotebookActions from '../../../../notebooks/notebook.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-add-to-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-to-notebook.html',
  styleUrls: ['./modal-add-to-notebook.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalAddToNotebookComponent {
  @Input() note: Note | null = null;

  @Output() edit = new EventEmitter<Notebook>();
  @Output() close = new EventEmitter<void>();
  @Output() notebookSelected = new EventEmitter<Notebook>();

  notebookTitle: string = '';

  searchTerm: string = '';
  private searchSubject = new BehaviorSubject<string>('');

  selectedNotebook: Notebook | null = null;
  notebooks$: Observable<Notebook[]>;
  filteredNotebooks$: Observable<Notebook[]> | undefined;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);

    this.filteredNotebooks$ = combineLatest([
      this.notebooks$,
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      ),
    ]).pipe(map(([notebooks, term]) => this.filterNotebooks(notebooks, term)));
  }

  private filterNotebooks(notebooks: Notebook[], term: string): Notebook[] {
    if (!term) return notebooks;
    const lowerTerm = term.toLowerCase();
    return notebooks.filter((notebook) =>
      notebook.name.toLowerCase().includes(lowerTerm)
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  selectNotebook(notebook: Notebook): void {
    if (!this.note) return;

    if (this.notebookContainsNote(notebook)) {
      alert('This note is already in the selected notebook.');
      return;
    }

    // Create a clean copy of the note
    const noteToAdd: Note = {
      ...this.note,
    };

    // Add the note to the selected notebook
    const updatedNotebook = {
      ...notebook,
      notes: [...notebook.notes, noteToAdd],
      updatedAt: Date.now(),
    };

    this.store.dispatch(
      NotebookActions.updateNotebook({
        update: {
          id: notebook.id,
          changes: {
            notes: updatedNotebook.notes,
          },
        },
      })
    );

    // Remove note from global notes
    this.store.dispatch(NoteActions.deleteNote({ id: this.note.id }));

    this.close.emit();
  }

  notebookContainsNote(notebook: Notebook): boolean {
    return notebook.notes.some((n) => n.id === this.note?.id);
  }

  openCreateNotebook(): void {
    this.close.emit();
    this.eventBus.emitCreateNotebook();
  }

  addNotebook() {
    if (!this.notebookTitle.trim()) {
      alert('Notebook title cannot be empty.');
      return;
    }

    const newNotebook: Notebook = {
      id: uuidv4(),
      name: this.notebookTitle.trim(),
      notes: [],
      createdAt: Date.now(),
    };

    this.store.dispatch(NotebookActions.addNotebook({ notebook: newNotebook }));
    this.notebookTitle = ''; // clears input
    this.close.emit();
  }

  editNotebook(notebook: Notebook) {
    this.edit.emit(notebook);
  }

  deleteNotebook(id: string) {
    if (confirm('Are you sure you want to delete this notebook?')) {
      this.store.dispatch(NotebookActions.deleteNotebook({ id }));
    }
  }
}
