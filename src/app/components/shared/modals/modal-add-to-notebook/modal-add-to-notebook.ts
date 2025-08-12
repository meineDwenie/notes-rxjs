import {
  Component,
  Output,
  EventEmitter,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { EventBusService } from '../../../../services/event-bus.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  selectedNotebook: Notebook | null = null;
  notebooks$: Observable<Notebook[]>;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  selectNotebook(nb: Notebook): void {
    if (this.note) {
      const alreadyInNotebook = nb.notes.some((n) => n.id === this.note!.id);
      if (!alreadyInNotebook) {
        const updatedNotebook = {
          ...nb,
          notes: [...nb.notes, this.note],
        };
        this.store.dispatch(
          NotebookActions.updateNotebook({
            update: {
              id: nb.id,
              changes: { notes: updatedNotebook.notes },
            },
          })
        );
      }
    }

    this.selectedNotebook = nb;
    this.notebookSelected.emit(nb);
    this.close.emit();
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
