import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-notebook.component.html',
  styleUrl: './modal-edit-notebook.component.css',
})
export class ModalEditNotebookComponent {
  @Input() notebookName: string = '';

  @Output() notebookNameChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackgroundClick(): void {
    this.cancel.emit();
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onNameInput(value: string) {
    this.notebookName = value;
    this.notebookNameChange.emit(value);
  }

  ngOnChanges() {
    // Emit any name changes automatically
    this.notebookNameChange.emit(this.notebookName);
  }
}
