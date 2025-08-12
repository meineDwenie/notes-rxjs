import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EventBusService } from '../../../services/event-bus.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from 'rxjs';

import { ClickOutsideDirective } from '../../../directives/click-outside-directive';

import { Note } from '../../../notes/note.model';
import { Notebook } from '../../../notebooks/notebook.model';
import * as NoteSelectors from '../../../notes/note.selectors';
import * as NotebookSelectors from '../../../notebooks/notebook.selectors';
import * as NoteActions from '../../../notes/note.actions';
import * as NotebookActions from '../../../notebooks/notebook.actions';
import { NoteComponent } from '../../note/note';
import { ButtonMainComponent } from '../../shared/button-main/button-main';

@Component({
  selector: 'app-all-view',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    NoteComponent,
    ButtonMainComponent,
  ],
  templateUrl: './all-view.html',
  styleUrl: './all-view.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AllView implements OnInit {
  @Output() noteSelected = new EventEmitter<Note>();
  @Output() notebookSelected = new EventEmitter<Notebook>();
  @Output() editNotebookRequested = new EventEmitter<Notebook>();

  allNotes$: Observable<Note[]>;
  filteredNotes$!: Observable<Note[]>;
  filteredNotebooks$!: Observable<Notebook[]>;
  pinnedNotes$!: Observable<Note[]>;
  notebooks$: Observable<Notebook[]>;

  // Boolean observables
  isLoading$!: Observable<boolean>;
  hasNotes$!: Observable<boolean>;
  hasNotebooks$!: Observable<boolean>;
  hasPins$!: Observable<boolean>;
  hasUnpinnedNotes$!: Observable<boolean>;

  //isEmpty$: Observable<boolean>;

  searchTerm: string = '';
  selectedNotebook: Notebook | null = null;
  openNotebookOptionsId: string | null = null;
  private searchTermSubject = new BehaviorSubject<string>('');

  constructor(private store: Store, private eventBus: EventBusService) {
    this.isLoading$ = this.store.select(NoteSelectors.selectNotesLoading);
    this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);

    // Filter unpinned notes
    this.filteredNotes$ = combineLatest([
      this.allNotes$,
      this.searchTermSubject
        .asObservable()
        .pipe(debounceTime(300), distinctUntilChanged(), startWith('')),
    ]).pipe(
      map(([notes, term]) =>
        this.filterNotes(
          notes.filter((n) => !n.pinned),
          term
        )
      )
    );

    // Filter pinned notes
    this.pinnedNotes$ = combineLatest([
      this.allNotes$.pipe(map((notes) => notes.filter((note) => note.pinned))),
      this.searchTermSubject
        .asObservable()
        .pipe(debounceTime(300), distinctUntilChanged(), startWith('')),
    ]).pipe(map(([notes, term]) => this.filterNotes(notes, term)));

    // Filter notebooks
    this.filteredNotebooks$ = combineLatest([
      this.notebooks$,
      this.searchTermSubject
        .asObservable()
        .pipe(debounceTime(300), distinctUntilChanged(), startWith('')),
    ]).pipe(map(([notebooks, term]) => this.filterNotebooks(notebooks, term)));

    // Boolean observables
    this.hasNotes$ = this.allNotes$.pipe(map((notes) => notes.length > 0));
    this.hasNotebooks$ = this.notebooks$.pipe(
      map((notebooks) => notebooks.length > 0)
    );
    this.hasPins$ = this.pinnedNotes$.pipe(map((pinned) => pinned.length > 0));
    this.hasUnpinnedNotes$ = this.filteredNotes$.pipe(
      map((notes) => notes.length > 0)
    );
  }

  ngOnInit() {}

  onSearchTermChange(newSearchTerm: string) {
    this.searchTerm = newSearchTerm;
    this.searchTermSubject.next(newSearchTerm);
  }

  filterNotes(notes: Note[], term: string): Note[] {
    let filtered = notes;

    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerTerm) ||
          note.content.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort by newest first
    try {
      return [...filtered].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
    } catch (err) {
      console.error('Sorting failed:', err, filtered);
      return filtered;
    }
  }

  // NOTES methods
  openNoteModal(note: Note): void {
    this.eventBus.emitNoteSelected(note);
  }

  deleteNote(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.store.dispatch(NoteActions.deleteNote({ id }));
    }
  }

  togglePin(note: Note, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(NoteActions.togglePinNote({ id: note.id }));
  }

  // NOTEBOOK methods
  filterNotebooks(notebooks: Notebook[], term: string): Notebook[] {
    if (!term) return notebooks;

    const lowerTerm = term.toLowerCase();
    return notebooks.filter((notebook) =>
      notebook.name.toLowerCase().includes(lowerTerm)
    );
  }

  selectNotebook(notebook: Notebook): void {
    this.selectedNotebook = notebook;
    this.eventBus.emitNotebookSelected(notebook);
  }

  deleteNotebook(id: string): void {
    if (confirm('Are you sure you want to delete this notebook?')) {
      this.store.dispatch(NotebookActions.deleteNotebook({ id }));
    }
  }

  closeNotebook(): void {
    this.selectedNotebook = null;
  }

  // Toggle dropdown menu
  toggleNotebookOptions(notebookId: string): void {
    this.openNotebookOptionsId =
      this.openNotebookOptionsId === notebookId ? null : notebookId;
  }

  // Start editing notebook
  startEditingNotebook(notebook: Notebook): void {
    this.openNotebookOptionsId = null;
    this.eventBus.emitNotebookEdit(notebook); // now valid
  }

  handleNoteOptionSelected(action: string, note: Note) {
    switch (action) {
      case 'addToNotebook':
        // Open modal or whatever logic you want here
        this.openAddToNotebookModal(note);
        break;
      case 'delete':
        this.deleteNote(note.id);
        break;
    }
  }

  openAddToNotebookModal(note: Note) {
    // For simplicity, just pick notebook by name with prompt
    this.notebooks$
      .subscribe((notebooks) => {
        const notebookNames = notebooks.map((nb) => nb.name).join(', ');
        const selectedNotebookName = prompt(
          `Enter notebook name to add note to (available: ${notebookNames}):`
        );
        if (!selectedNotebookName) return;

        const notebook = notebooks.find(
          (nb) => nb.name.toLowerCase() === selectedNotebookName.toLowerCase()
        );
        if (!notebook) {
          alert('Notebook not found!');
          return;
        }
        this.addNoteToNotebook(note, notebook);
      })
      .unsubscribe();
  }

  addNoteToNotebook(note: Note, notebook: Notebook) {
    if (notebook.notes.some((n) => n.id === note.id)) {
      alert('Note already in this notebook');
      return;
    }
    const updatedNotebook = {
      ...notebook,
      notes: [...notebook.notes, note],
    };
    this.store.dispatch(
      NotebookActions.updateNotebook({
        update: {
          id: updatedNotebook.id,
          changes: { notes: updatedNotebook.notes },
        },
      })
    );
  }
}
