import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-note-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-note-edit.component.html',
  styleUrl: './modal-note-edit.component.css',
})
export class ModalNoteEditComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() color: string = '#ffffff';
  @Input() images: string[] = [];
  @Input() imageLoading: boolean[] = [];
  @Input() availableColors: string[] = [];

  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<number>();
  @Output() imageLoad = new EventEmitter<number>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
