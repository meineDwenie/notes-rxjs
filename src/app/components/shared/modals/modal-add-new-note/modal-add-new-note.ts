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

  // Color changes
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

  // Adding Images
  selectedImages: string[] = [];
  modalImages: string[] = [];
  imageLoading: boolean[] = [];
  modalImageLoading: boolean[] = [];

  // NOTEBOOK
  notebooks$: Observable<Notebook[]>;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  ngOnInit() {
    // Prevents scrolling outside modal
    document.body.classList.add('modal-open');
  }

  ngOnDestroy() {
    // Prevents scrolling outside modal
    document.body.classList.remove('modal-open');
  }

  ngAfterViewInit() {
    // Focus on the textarea when modal opens
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

    const newNote: Note = {
      id: uuidv4(),
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      pinned: this.notePinned,
      createdAt: Date.now(),
      images: [...this.selectedImages],
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
    this.modalImages = []; // Also reset modal images
    this.imageLoading = [];
    this.modalImageLoading = []; // Also reset modal loading states

    if (this.noteTextarea) {
      const el = this.noteTextarea.nativeElement;
      el.style.height = 'auto';
    }
  }

  triggerImageUpload() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        const currentIndex = this.selectedImages.length;
        this.imageLoading.push(true);

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.selectedImages.push(reader.result);
            this.imageLoading[currentIndex] = false;
          }
        };
        reader.readAsDataURL(file);
      });
      input.value = '';
    }
  }

  removeSelectedImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.imageLoading.splice(index, 1);
  }

  togglePin() {
    this.notePinned = !this.notePinned;
  }

  getNoteForEmit(): Note {
    return {
      id: '',
      title: this.noteTitle,
      content: this.noteContent,
      color: this.noteColor,
      pinned: this.notePinned,
      createdAt: Date.now(),
      images: [...this.selectedImages],
    };
  }
}
