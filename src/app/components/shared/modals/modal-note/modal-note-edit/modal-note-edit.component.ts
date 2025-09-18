import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { AutoResizeDirective } from '../../../../../directives/auto-resize.directive';
import { ButtonFeatureComponent } from '../../../button-feature/button-feature';
import {
  CheckboxItem,
  DraggableCheckboxesComponent,
} from '../../../draggable-checkboxes/draggable-checkboxes.component';

@Component({
  selector: 'app-modal-note-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonFeatureComponent,
    AutoResizeDirective,
    DraggableCheckboxesComponent,
  ],
  templateUrl: './modal-note-edit.component.html',
  styleUrl: './modal-note-edit.component.css',
})
export class ModalNoteEditComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() color: string = '#ffffff';
  @Input() images: string[] = [];
  @Input() imageLoading: boolean[] = [];
  @Input() availableColors: string[] = [];
  @Input() clickedSection: 'title' | 'content' = 'content';
  @Input() checkboxes: CheckboxItem[] = [];
  @Input() shouldAddCheckboxes: boolean = false;

  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() removeImage = new EventEmitter<number>();
  @Output() imageLoad = new EventEmitter<number>();
  @Output() imagesUpdated = new EventEmitter<{
    images: string[];
    imageLoading: boolean[];
  }>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() addCheckboxes = new EventEmitter<void>();
  @Output() checkboxesChange = new EventEmitter<CheckboxItem[]>();

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('textAreaInput') textAreaInput!: ElementRef;
  @ViewChild('modalImageInput') modalImageInput!: ElementRef<HTMLInputElement>;

  selectedImage: string | null = null;
  showCheckboxes: boolean = false;
  localCheckboxes: CheckboxItem[] = [];

  ngOnInit() {
    this.initializeCheckboxState();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update local state when input changes
    if (changes['checkboxes'] || changes['shouldAddCheckboxes']) {
      this.initializeCheckboxState();
    }
  }

  private initializeCheckboxState() {
    this.localCheckboxes = [...this.checkboxes];

    // Show checkboxes if we have any, or if we should add checkboxes
    this.showCheckboxes =
      this.checkboxes.length > 0 || this.shouldAddCheckboxes;

    // If we should add checkboxes but don't have any yet
    if (this.shouldAddCheckboxes && this.localCheckboxes.length === 0) {
      this.convertContentToCheckboxes();
    }
  }

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

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      // Append placeholders for loading state
      const newImagesLoading = files.map(() => true);
      this.imageLoading = [...this.imageLoading, ...newImagesLoading];
      this.images = [...this.images, ...Array(files.length).fill('')];

      // Read files as base64
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            // Replace the placeholder with actual base64 string
            const imgIndex = this.images.length - files.length + index;
            this.images[imgIndex] = reader.result;
            this.imageLoading[imgIndex] = false;
            // Emit updated arrays
            this.imagesUpdated.emit({
              images: this.images,
              imageLoading: this.imageLoading,
            });
          }
        };
        reader.readAsDataURL(file);
      });

      input.value = ''; // reset input so same file can be selected again
    }
  }

  onAddCheckboxes() {
    if (!this.showCheckboxes) {
      this.showCheckboxes = true;
      this.convertContentToCheckboxes();
    } else {
      // If already showing checkboxes, add a new empty one
      this.localCheckboxes.push({
        id: Date.now().toString(),
        text: '',
        checked: false,
        order: this.localCheckboxes.length,
      });
      this.emitCheckboxChanges();
    }
  }

  onCheckboxesChanged(checkboxes: CheckboxItem[]) {
    console.log('Modal edit received checkbox changes:', checkboxes);
    this.localCheckboxes = [...checkboxes];
    this.emitCheckboxChanges();
  }

  // New method to ensure checkbox changes are always emitted
  private emitCheckboxChanges() {
    this.checkboxesChange.emit([...this.localCheckboxes]);
  }

  // Method to handle individual checkbox updates (text changes, check/uncheck)
  onCheckboxUpdated(updatedCheckbox: CheckboxItem) {
    this.localCheckboxes = this.localCheckboxes.map((cb) =>
      cb.id === updatedCheckbox.id ? { ...updatedCheckbox } : cb
    );
    this.emitCheckboxChanges();
  }

  convertContentToCheckboxes() {
    if (this.content.trim()) {
      const lines = this.content.split('\n').filter((line) => line.trim());
      this.localCheckboxes = lines.map((line, index) => ({
        id: `${Date.now()}-${index}`,
        text: line.trim(),
        checked: false,
        order: index,
      }));

      // Clear the content since it's now in checkboxes
      this.content = '';
      this.contentChange.emit('');
    } else if (this.localCheckboxes.length === 0) {
      // Add an empty checkbox to start with
      this.localCheckboxes = [
        {
          id: Date.now().toString(),
          text: '',
          checked: false,
          order: 0,
        },
      ];
    }
    this.emitCheckboxChanges();
  }

  toggleCheckboxMode() {
    this.showCheckboxes = !this.showCheckboxes;

    if (!this.showCheckboxes) {
      // Convert checkboxes back to content
      const contentFromCheckboxes = this.localCheckboxes
        .sort((a, b) => a.order - b.order)
        .map((cb) => cb.text)
        .filter((text) => text.trim())
        .join('\n');

      this.content = contentFromCheckboxes;
      this.contentChange.emit(this.content);
      this.localCheckboxes = [];
      this.emitCheckboxChanges();
    } else {
      this.convertContentToCheckboxes();
    }
  }
}
