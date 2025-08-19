import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Note } from '../notes/note.model';
import { Notebook } from '../notebooks/notebook.model';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private noteSelectedSource = new Subject<Note>();
  private notebookSelectedSource = new Subject<Notebook>();
  private notebookEditRequestedSource = new Subject<Notebook>();
  private openAddNoteModalSource = new Subject<void>();
  private openAddToNotebookModalSource = new Subject<Note>();
  private createNoteSubject = new Subject<void>();
  private createNotebookSubject = new Subject<void>();
  // private searchTermSubject = new BehaviorSubject<string>('');

  noteSelected$ = this.noteSelectedSource.asObservable();
  notebookSelected$ = this.notebookSelectedSource.asObservable();
  notebookEditRequested$ = this.notebookEditRequestedSource.asObservable();
  openAddNoteModal$ = this.openAddNoteModalSource.asObservable();
  openAddToNotebookModal$ = this.openAddToNotebookModalSource.asObservable();
  createNote$ = this.createNoteSubject.asObservable();
  createNotebook$ = this.createNotebookSubject.asObservable();
  // searchTerm$ = this.searchTermSubject.asObservable();

  emitNoteSelected(note: Note) {
    this.noteSelectedSource.next(note);
  }

  emitNotebookSelected(notebook: Notebook) {
    this.notebookSelectedSource.next(notebook);
  }

  emitNotebookEdit(notebook: Notebook) {
    this.notebookEditRequestedSource.next(notebook);
  }

  emitCreateNote(): void {
    this.createNoteSubject.next();
  }

  emitCreateNotebook(): void {
    this.createNotebookSubject.next();
  }

  // emitSearchTerm(term: string): void {
  //   this.searchTermSubject.next(term);
  // }

  triggerAddNoteModal() {
    this.openAddNoteModalSource.next();
  }

  triggerAddToNotebookModal(note: Note) {
    this.openAddToNotebookModalSource.next(note);
  }
}
