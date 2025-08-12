import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EventBusService } from '../../services/event-bus.service';

import { ButtonFeatureComponent } from '../shared/button-feature/button-feature';

import { Note } from '../../notes/note.model';
import { Notebook } from '../../notebooks/notebook.model';
import * as NoteSelectors from '../../notes/note.selectors';
import * as NotebookSelectors from '../../notebooks/notebook.selectors';
import * as NoteActions from '../../notes/note.actions';
import * as NotebookActions from '../../notebooks/notebook.actions';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, ButtonFeatureComponent],
  templateUrl: './note.html',
  styleUrls: ['./note.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NoteComponent {
  @Input() note!: Note;

  @Output() open = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();
  @Output() togglePin = new EventEmitter<{ note: Note; event: MouseEvent }>();
  @Output() optionSelected = new EventEmitter<string>();
  @Output() addToNotebook = new EventEmitter<Note>();

  notebooks$: Observable<Notebook[]>;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  onOpen() {
    this.open.emit(this.note);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.note.id);
  }

  onTogglePin(event: MouseEvent) {
    this.togglePin.emit({ note: this.note, event });
  }

  onOptionSelected(action: string) {
    switch (action) {
      case 'addToNotebook':
        this.optionSelected.emit('addToNotebook');
        this.addToNotebook.emit(this.note);
        break;
      case 'delete':
        this.onDelete({ stopPropagation: () => {} } as MouseEvent);
        break;
    }
  }

  openAddToNotebookModal(note: Note) {
    this.eventBus.triggerAddToNotebookModal(note);
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
