import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';

import { Notebook } from '../../../../notebooks/notebook.model';
import * as NotebookActions from '../../../../notebooks/notebook.actions';
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
    if (!this.notebookTitle.trim()) {
      alert('Please enter a notebook title.');
      return;
    }

    const newNotebook: Notebook = {
      id: uuidv4(),
      name: this.notebookTitle.trim(),
      notes: [],
      createdAt: Date.now(),
    };

    this.store.dispatch(NotebookActions.addNotebook({ notebook: newNotebook }));
    this.notebookCreated.emit(newNotebook);
    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }
}
