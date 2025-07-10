import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as NoteActions from './notes/note.actions';
import * as NoteSelectors from './notes/note.selectors';
import { Note } from './notes/note.model';

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
import { autoResizeDirective } from './directives/auto-resize.directive';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, autoResizeDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'angular-ngrx-notes-app';

  allNotes$!: Observable<Note[]>;
  isLoading$!: Observable<boolean>;
  filteredNotes$!: Observable<Note[]>;

  noteTitle: string = '';
  noteContent: string = '';
  editingNoteID: string | null = null;
  searchTerm: string = '';

  selectedNote: Note | null = null;

  // Modal edit state
  isModalEditing: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';

  private searchTermSubject = new BehaviorSubject<string>('');

  constructor(private store: Store) {
    this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
    this.isLoading$ = this.store.select(NoteSelectors.selectNotesLoading);

    this.filteredNotes$ = combineLatest([
      this.allNotes$,
      this.searchTermSubject
        .asObservable()
        .pipe(debounceTime(300), distinctUntilChanged(), startWith('')),
    ]).pipe(map(([notes, term]) => this.filterNotes(notes, term)));
  }

  ngOnInit(): void {}

  onSearchTermChange(newSearchTerm: string) {
    this.searchTerm = newSearchTerm;
    this.searchTermSubject.next(newSearchTerm);
  }

  addOrUpdateNote() {
    if (!this.noteTitle.trim() || !this.noteContent.trim()) {
      alert('Note title and content cannot be empty.');
      return;
    }

    if (this.editingNoteID) {
      const update = {
        id: this.editingNoteID,
        changes: { title: this.noteTitle, content: this.noteContent },
      };
      this.store.dispatch(NoteActions.updateNote({ update }));
    } else {
      const newNote: Note = {
        id: uuidv4(),
        title: this.noteTitle,
        content: this.noteContent,
      };
      this.store.dispatch(NoteActions.addNote({ note: newNote }));
    }

    this.resetForm();
  }

  editNote(note: Note) {
    this.editingNoteID = note.id;
    this.noteTitle = note.title;
    this.noteContent = note.content;
  }

  deleteNote(id: string) {
    if (confirm('Are you sure you want to delete the note?')) {
      this.store.dispatch(NoteActions.deleteNote({ id }));
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  @ViewChild('noteTextArea') noteTextarea!: ElementRef<HTMLTextAreaElement>;

  resetForm() {
    this.editingNoteID = null;
    this.noteTitle = '';
    this.noteContent = '';

    if (this.noteTextarea) {
      const el = this.noteTextarea.nativeElement;
      el.style.height = 'auto';
    }
  }

  filterNotes(notes: Note[], term: string) {
    if (!term) return notes;

    const lowerTerm = term.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerTerm) ||
        note.content.toLowerCase().includes(lowerTerm)
    );
  }

  // === MODAL LOGIC ===
  openNoteModal(note: Note): void {
    this.selectedNote = note;
    this.isModalEditing = false;
    this.modalTitle = note.title;
    this.modalContent = note.content;
  }

  closeNoteModal(): void {
    this.selectedNote = null;
    this.isModalEditing = false;
  }

  enableModalEdit(): void {
    this.isModalEditing = true;
  }

  cancelModalEdit(): void {
    this.isModalEditing = false;
    if (this.selectedNote) {
      this.modalTitle = this.selectedNote.title;
      this.modalContent = this.selectedNote.content;
    }
  }

  saveModalEdit(): void {
    if (this.selectedNote) {
      const updatedNote = {
        ...this.selectedNote,
        title: this.modalTitle.trim(),
        content: this.modalContent.trim(),
      };

      const update = {
        id: updatedNote.id,
        changes: { title: updatedNote.title, content: updatedNote.content },
      };

      this.store.dispatch(NoteActions.updateNote({ update }));
      this.selectedNote = updatedNote;
      this.isModalEditing = false;
    }
  }
}
