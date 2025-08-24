import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../../../notes/note.model';
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

  @Output() edit = new EventEmitter<'title' | 'content'>();
  @Output() close = new EventEmitter<void>();

  onEdit(section: 'title' | 'content'): void {
    this.edit.emit(section);
  }

  onClose(): void {
    this.close.emit();
  }
}
