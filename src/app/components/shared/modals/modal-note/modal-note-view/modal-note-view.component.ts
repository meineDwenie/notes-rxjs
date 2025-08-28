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

  // openImageInNewTab(imgUrl: string): void {
  //   const newTab = window.open();
  //   if (newTab) {
  //     newTab.document.body.style.margin = '0';
  //     const img = newTab.document.createElement('img');
  //     img.src = imgUrl;
  //     img.style.maxWidth = '100%';
  //     img.style.maxHeight = '100vh';
  //     img.style.display = 'block';
  //     img.style.margin = '0 auto';
  //     newTab.document.body.appendChild(img);
  //   } else {
  //     alert('Popup blocked. Please allow popups for this site.');
  //   }
  // }
}
