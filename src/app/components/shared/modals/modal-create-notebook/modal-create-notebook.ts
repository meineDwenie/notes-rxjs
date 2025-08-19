import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { Notebook } from '../../../../notebooks/notebook.model';
import * as NotebookActions from '../../../../notebooks/notebook.actions';
import * as NotebookSelectors from '../../../../notebooks/notebook.selectors';
import { ClickOutsideDirective } from '../../../../directives/click-outside-directive';

@Component({
  selector: 'app-modal-create-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './modal-create-notebook.html',
  styleUrl: './modal-create-notebook.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalCreateNotebookComponent {
  @Output() close = new EventEmitter<void>();
  @Output() notebookCreated = new EventEmitter<Notebook>();

  @ViewChild('titleInput') titleInput!: ElementRef;

  notebookTitle: string = '';
  notebookDescription: string = '';

  constructor(private store: Store) {}

  ngAfterViewInit() {
    // Focus on the title input when modal opens
    this.titleInput?.nativeElement?.focus();
  }

  createNotebook(): void {
    const trimmedTitle = this.notebookTitle.trim();

    if (!trimmedTitle) {
      alert('Please enter a notebook title.');
      return;
    }

    this.store
      .select(NotebookSelectors.selectAllNotebooks)
      .pipe(take(1)) // Automatically unsubscribes after first value
      .subscribe((notebooks) => {
        const duplicate = notebooks.find(
          (notebook) =>
            notebook.name.toLowerCase() === trimmedTitle.toLowerCase()
        );

        if (duplicate) {
          alert('A notebook with this title already exists.');
          return; // Exit early
        }

        const newNotebook: Notebook = {
          id: uuidv4(),
          name: trimmedTitle,
          notes: [],
          createdAt: Date.now(),
        };

        this.store.dispatch(
          NotebookActions.addNotebook({ notebook: newNotebook })
        );
        this.notebookCreated.emit(newNotebook);
        this.close.emit();
      });
  }

  onCancel(): void {
    this.close.emit();
  }
}
