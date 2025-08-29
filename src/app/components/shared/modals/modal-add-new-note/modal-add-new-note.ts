import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../../../services/event-bus.service';
import { ButtonFeatureComponent } from '../../button-feature/button-feature';
import { ClickOutsideDirective } from '../../../../directives/click-outside-directive';

import { Note } from '../../../../notes/note.model';
import { Notebook } from '../../../../notebooks/notebook.model';
import * as NoteActions from '../../../../notes/note.actions';
import * as NotebookSelectors from '../../../../notebooks/notebook.selectors';
import * as NotebookActions from '../../../../notebooks/notebook.actions';

@Component({
  selector: 'app-modal-add-new-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonFeatureComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './modal-add-new-note.html',
  styleUrls: ['./modal-add-new-note.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalAddNewNoteComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  @ViewChild('noteTextArea') noteTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // NOTE
  noteTitle: string = '';
  noteContent: string = '';
  editingNoteID: string | null = null;
  searchTerm: string = '';

  selectedNote: Note | null = null;
  notePinned: boolean = false;
  selectedNotebookId: string | null = null;

  // COLOR CHANGES
  noteColor: string = '#ffffff'; // Default cpolor for new notes
  modalColor: string = '#ffffff'; // For modal editing

  availableColors: string[] = [
    '#ffffff', // White
    '#ffc8c2ff', // Red
    '#ffe09dff', // Orange
    '#fffbcdff', // Yellow
    '#e0fcc1ff', // Green
    '#caf6edff', // Teal
    '#cceff7ff', // Light Blue
    '#e0d6e9ff', // Purple
  ];

  // ADDING IMAGES
  selectedImage: string | null = null;
  selectedImages: { data: string; loading: boolean; id: string }[] = [];

  // NOTEBOOK
  notebooks$: Observable<Notebook[]>;

  constructor(
    private store: Store,
    private eventBus: EventBusService,
    private cdr: ChangeDetectorRef
  ) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  // Prevents scrolling outside modal
  ngOnInit() {
    document.body.classList.add('modal-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('modal-open');
  }

  // Focuses on the textarea when modal opens
  ngAfterViewInit() {
    this.noteTextarea?.nativeElement?.focus();
  }

  openAddNoteModal() {
    this.eventBus.triggerAddNoteModal();
  }

  openAddToNotebookModal(note: Note) {
    this.eventBus.triggerAddToNotebookModal(note);
  }

  // NOTES methods
  addNote() {
    if (!this.noteTitle.trim() || !this.noteContent.trim()) {
      alert('Note title and content cannot be empty.');
      return;
    }

    // Only include loaded images
    const loadedImages = this.selectedImages
      .filter((img) => !img.loading)
      .map((img) => img.data);

    const newNote: Note = {
      id: uuidv4(),
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      pinned: this.notePinned,
      createdAt: Date.now(),
      images: loadedImages,
    };

    this.store.dispatch(NoteActions.addNote({ note: newNote }));

    // Add to selected notebook (if any)
    if (this.selectedNotebookId) {
      const allNotebooks = this.notebooks$;
      allNotebooks
        .subscribe((notebooks) => {
          const notebook = notebooks.find(
            (nb) => nb.id === this.selectedNotebookId
          );
          if (notebook) {
            const updatedNotebook = {
              ...notebook,
              notes: [...notebook.notes, newNote],
            };
            this.store.dispatch(
              NotebookActions.updateNotebook({
                update: {
                  id: updatedNotebook.id,
                  changes: { notes: updatedNotebook.notes },
                },
              })
            );
          }
        })
        .unsubscribe();
    }

    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.editingNoteID = null;
    this.noteTitle = '';
    this.noteContent = '';
    this.noteColor = '#ffffff';
    this.notePinned = false;
    this.selectedNotebookId = null;
    this.selectedImages = [];

    if (this.noteTextarea) {
      const el = this.noteTextarea.nativeElement;
      el.style.height = 'auto';
    }
  }

  /* IMAGES methods */
  triggerImageUpload() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Process each selected file
      Array.from(input.files).forEach((file) => {
        // Create a unique ID for this image
        const imageId = uuidv4();

        // Add placeholder with loading state immediately
        this.selectedImages.push({
          data: '',
          loading: true,
          id: imageId,
        });

        // Force change detection to show loading state immediately
        this.cdr.detectChanges();

        // Process the file
        const reader = new FileReader();

        reader.onload = (e) => {
          // Find the image by ID and update it
          const imageIndex = this.selectedImages.findIndex(
            (img) => img.id === imageId
          );
          if (imageIndex !== -1 && typeof reader.result === 'string') {
            this.selectedImages[imageIndex] = {
              data: reader.result,
              loading: false,
              id: imageId,
            };

            // Trigger change detection
            this.cdr.detectChanges();
          }
        };

        reader.onerror = () => {
          // Remove failed image
          this.selectedImages = this.selectedImages.filter(
            (img) => img.id !== imageId
          );
          this.cdr.detectChanges();
          console.error('Error reading file:', file.name);
        };

        // Start reading the file
        reader.readAsDataURL(file);
      });

      // Clear the input
      input.value = '';
    }
  }

  removeSelectedImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.cdr.detectChanges();
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  // Helper method to check if all images are loaded
  get allImagesLoaded(): boolean {
    return this.selectedImages.every((img) => !img.loading);
  }

  // Helper method to get loading count
  get loadingImagesCount(): number {
    return this.selectedImages.filter((img) => img.loading).length;
  }

  /* PIN function */
  togglePin() {
    this.notePinned = !this.notePinned;
  }

  getNoteForEmit(): Note {
    const loadedImages = this.selectedImages
      .filter((img) => !img.loading)
      .map((img) => img.data);

    return {
      id: '',
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      pinned: this.notePinned,
      createdAt: Date.now(),
      images: loadedImages,
    };
  }
}
