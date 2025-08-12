import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from '../notes/note.model';
import { Notebook } from '../notebooks/notebook.model';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private noteSelectedSource = new Subject<Note>();
  private notebookSelectedSource = new Subject<Notebook>();
  private notebookEditRequestedSource = new Subject<Notebook>();
  private openAddToNotebookModalSource = new Subject<Note>();

  noteSelected$ = this.noteSelectedSource.asObservable();
  notebookSelected$ = this.notebookSelectedSource.asObservable();
  notebookEditRequested$ = this.notebookEditRequestedSource.asObservable();
  openAddToNotebookModal$ = this.openAddToNotebookModalSource.asObservable();

  emitNoteSelected(note: Note) {
    this.noteSelectedSource.next(note);
  }

  emitNotebookSelected(notebook: Notebook) {
    this.notebookSelectedSource.next(notebook);
  }

  emitNotebookEdit(notebook: Notebook) {
    this.notebookEditRequestedSource.next(notebook);
  }

  triggerAddToNotebookModal(note: Note) {
    this.openAddToNotebookModalSource.next(note);
  }
}
