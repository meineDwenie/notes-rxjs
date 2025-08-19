import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../../../notes/note.model';
import { ModalNoteViewComponent } from '../modal-note-view/modal-note-view.component';
import { ModalNoteEditComponent } from '../modal-note-edit/modal-note-edit.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-note',
  standalone: true,
  imports: [NgIf, FormsModule, ModalNoteViewComponent, ModalNoteEditComponent],
  templateUrl: './modal-note.component.html',
  styleUrl: './modal-note.component.css',
})
export class ModalNoteComponent {
  @Input() note!: Note;
  @Input() isEditing = false;
  @Input() modalTitle = '';
  @Input() modalContent = '';
  @Input() modalColor = '#ffffff';
  @Input() modalImages: string[] = [];
  @Input() modalImageLoading: boolean[] = [];
  @Input() availableColors: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<number>();
  @Output() imageLoad = new EventEmitter<number>();

  closeModal() {
    this.close.emit();
  }

  enableEditMode() {
    this.edit.emit();
  }
}
