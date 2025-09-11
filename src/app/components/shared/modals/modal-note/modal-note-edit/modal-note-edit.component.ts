import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonFeatureComponent } from '../../../button-feature/button-feature';

@Component({
  selector: 'app-modal-note-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonFeatureComponent],
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
  @Input() clickedSection: 'title' | 'content' = 'content';

  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<number>();
  @Output() imageLoad = new EventEmitter<number>();
  @Output() imagesUpdated = new EventEmitter<string[]>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() addCheckboxes = new EventEmitter<void>();

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('textAreaInput') textAreaInput!: ElementRef;
  @ViewChild('modalImageInput') modalImageInput!: ElementRef<HTMLInputElement>;

  selectedImage: string | null = null;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.clickedSection == 'title') {
        this.titleInput?.nativeElement?.focus();
      } else {
        this.textAreaInput?.nativeElement?.focus();
      }
    });
  }

  onBackgroundClick(): void {
    this.cancel.emit();
  }

  triggerImageUpload(event: MouseEvent) {
    event.stopPropagation();
    this.modalImageInput.nativeElement.click();
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }
}
