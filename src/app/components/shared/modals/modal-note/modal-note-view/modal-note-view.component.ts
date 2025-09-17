import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CheckboxItem, Note } from '../../../../../notes/note.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-note-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-note-view.component.html',
  styleUrl: './modal-note-view.component.css',
})
export class ModalNoteViewComponent {
  @Input() note!: Note;
  @Input() images: string[] = [];
  @Input() checkboxes: CheckboxItem[] = [];

  @Output() edit = new EventEmitter<'title' | 'content'>();
  @Output() close = new EventEmitter<void>();
  @Output() checkboxToggle = new EventEmitter<{
    checkboxId: string;
    checked: boolean;
  }>();

  selectedImage: string | null = null;

  onEdit(section: 'title' | 'content'): void {
    this.edit.emit(section);
  }

  onClose(): void {
    this.close.emit();
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  toggleCheckbox(checkbox: CheckboxItem, event: Event): void {
    event.stopPropagation();
    const newChecked = !checkbox.checked;
    this.checkboxToggle.emit({ checkboxId: checkbox.id, checked: newChecked });
  }
}
