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
  selector: 'app-trash-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trash-view.html',
  styleUrl: './trash-view.css',
})
export class TrashView {
  //export class TrashView implements OnInit, OnDestroy {
  // allNotes$!: Observable<Note[]>;
  // searchTerm$!: Observable<string>;
  // // Trash-specific observables
  // trashedNotes$!: Observable<Note[]>;
  // filteredTrashedNotes$!: Observable<Note[]>;
  // // Boolean observables
  // hasTrashedNotes$!: Observable<boolean>;
  // hasSearchResults$!: Observable<boolean>;
  // private destroy$ = new Subject<void>();
  // constructor(private store: Store) {}
  // ngOnInit() {
  //   this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
  //   this.searchTerm$ = this.store.select(NoteSelectors.selectSearchTerm);
  //   // Get all trashed notes (assuming you add a 'trashed' property to Note model)
  //   this.trashedNotes$ = this.allNotes$.pipe(
  //     map((notes) => notes.filter((note) => note.trashed === true)),
  //     takeUntil(this.destroy$)
  //   );
  //   // Filter trashed notes based on search term
  //   this.filteredTrashedNotes$ = combineLatest([
  //     this.trashedNotes$,
  //     this.searchTerm$,
  //   ]).pipe(
  //     map(([trashedNotes, searchTerm]) => {
  //       if (!searchTerm.trim()) {
  //         return trashedNotes;
  //       }
  //       return trashedNotes.filter(
  //         (note) =>
  //           note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           note.content.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     }),
  //     takeUntil(this.destroy$)
  //   );
  //   // Boolean observables for template conditions
  //   this.hasTrashedNotes$ = this.trashedNotes$.pipe(
  //     map((notes) => notes.length > 0)
  //   );
  //   this.hasSearchResults$ = this.filteredTrashedNotes$.pipe(
  //     map((notes) => notes.length > 0)
  //   );
  // }
  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
  // trackByNoteId(index: number, note: Note): string {
  //   return note.id;
  // }
  // restoreNote(note: Note) {
  //   if (confirm('Restore this note from trash?')) {
  //     this.store.dispatch(
  //       NoteActions.updateNote({
  //         update: {
  //           id: note.id,
  //           changes: { trashed: false },
  //         },
  //       })
  //     );
  //   }
  // }
  // permanentlyDeleteNote(noteId: string) {
  //   if (
  //     confirm('Permanently delete this note? This action cannot be undone.')
  //   ) {
  //     this.store.dispatch(NoteActions.deleteNote({ id: noteId }));
  //   }
  // }
  // emptyTrash() {
  //   if (
  //     confirm(
  //       'Empty trash? All notes will be permanently deleted. This action cannot be undone.'
  //     )
  //   ) {
  //     this.trashedNotes$.pipe(take(1)).subscribe((trashedNotes) => {
  //       trashedNotes.forEach((note) => {
  //         this.store.dispatch(NoteActions.deleteNote({ id: note.id }));
  //       });
  //     });
  //   }
  // }
}
