import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Note } from '../../../../../notes/note.model';
import { ModalNoteViewComponent } from '../modal-note-view/modal-note-view.component';
import { ModalNoteEditComponent } from '../modal-note-edit/modal-note-edit.component';
import { FormsModule } from '@angular/forms';
import { EscKeyDirective } from '../../../../../directives/esc-key.directive';
import { CheckboxItem } from '../../../draggable-checkboxes/draggable-checkboxes.component';

@Component({
  selector: 'app-modal-note',
  standalone: true,
  imports: [
    FormsModule,
    ModalNoteViewComponent,
    ModalNoteEditComponent,
    EscKeyDirective,
  ],
  templateUrl: './modal-note.component.html',
  styleUrl: './modal-note.component.css',
})
export class ModalNoteComponent implements OnInit, OnDestroy {
  @Input() note!: Note;
  @Input() isEditing = false;
  @Input() modalTitle = '';
  @Input() modalContent = '';
  @Input() modalColor = '#ffffff';
  @Input() modalImages: string[] = [];
  @Input() modalImageLoading: boolean[] = [];
  @Input() availableColors: string[] = [];
  @Input() modalCheckboxes: CheckboxItem[] = [];
  @Input() shouldAddCheckboxes: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() imagesUpdated = new EventEmitter<string[]>();
  @Output() removeImage = new EventEmitter<number>();
  @Output() imageLoad = new EventEmitter<number>();
  @Output() checkboxesChange = new EventEmitter<CheckboxItem[]>();

  clickedSection: 'title' | 'content' = 'content';

  ngOnInit() {
    // Prevents scrolling outside modal
    document.body.classList.add('modal-open');
  }

  ngOnDestroy() {
    // Prevents scrolling outside modal
    document.body.classList.remove('modal-open');
  }

  closeModal() {
    this.close.emit();
  }

  onBackgroundClick(): void {
    this.close.emit();
  }

  enableEditMode(section: 'title' | 'content') {
    this.clickedSection = section;
    this.edit.emit();
  }

  onEscKeyPressed(): void {
    if (this.isEditing) {
      this.cancel.emit();
    } else {
      this.closeModal();
    }
  }

  onModalImagesUpdated(event: { images: string[]; imageLoading: boolean[] }) {
    this.modalImages = event.images;
    this.modalImageLoading = event.imageLoading;
    this.imagesUpdated.emit(event.images);
  }
}
