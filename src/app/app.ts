import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';

import { filter, map, Observable, take } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { EventBusService } from './services/event-bus.service';

import { v4 as uuidv4 } from 'uuid';
import { autoResizeDirective } from './directives/auto-resize.directive';

import { Note } from './notes/note.model';
import { Notebook } from './notebooks/notebook.model';
import * as NoteActions from './notes/note.actions';
import * as NotebookActions from './notebooks/notebook.actions';
import * as NotebookSelectors from './notebooks/notebook.selectors';

import { Sidebar } from './components/sidebar/sidebar';
import { HeaderComponent } from './components/header/header';
import { ModalAddToNotebookComponent } from './components/shared/modals/modal-add-to-notebook/modal-add-to-notebook';
import { ModalAddNewNoteComponent } from './components/shared/modals/modal-add-new-note/modal-add-new-note';
import { ModalCreateNotebookComponent } from './components/shared/modals/modal-create-notebook/modal-create-notebook';
import { ModalNoteComponent } from './components/shared/modals/modal-note/modal-note/modal-note.component';
import { ModalEditNotebookComponent } from './components/shared/modals/modal-edit-notebook/modal-edit-notebook.component';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    Sidebar,
    ModalAddToNotebookComponent,
    ModalAddNewNoteComponent,
    ModalCreateNotebookComponent,
    ModalNoteComponent,
    ModalEditNotebookComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewChecked {
  protected title = 'angular-ngrx-notes-app';

  @ViewChild('noteTextArea') noteTextarea!: ElementRef<HTMLTextAreaElement>;

  // Observables
  allNotes$!: Observable<Note[]>;
  filteredPinnedNotes$!: Observable<Note[]>;
  filteredNotebookNotes$!: Observable<Note[]>;
  filteredNotebooks$!: Observable<Notebook[]>;

  // Boolean observables
  isLoading$!: Observable<boolean>;
  hasNotes$!: Observable<boolean>;
  hasNotebooks$!: Observable<boolean>;
  hasPins$!: Observable<boolean>;
  hasUnpinnedNotes$!: Observable<boolean>;

  // NOTE
  noteTitle: string = '';
  noteContent: string = '';
  editingNoteID: string | null = null;
  searchTerm: string = '';

  selectedNote: Note | null = null;
  notePinned: boolean = false;

  // Modal edit state
  isModalEditing: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';

  showAddNoteModal: boolean = false;
  showAddToNotebookModal: boolean = false;
  showCreateNotebookModal = false;
  noteToAddToNotebook: Note | null = null;

  // Adding Images
  selectedImages: string[] = [];
  modalImages: string[] = [];
  imageLoading: boolean[] = [];
  modalImageLoading: boolean[] = [];

  // Color changes
  noteColor: string = '#ffffff'; // Default cpolor for new notes
  modalColor: string = '#ffffff'; // For modal editing

  viewMode: 'grid' | 'column' = 'grid'; // Default view mode
  activeFilters: Array<{ id: string; label: string }> = [];

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

  // NOTEBOOKS
  notebooks$!: Observable<Notebook[]>;
  notebookTitle: string = '';
  editingNotebook: boolean = false;
  editingNotebookId: string | null = null;
  editingNotebookName: string = '';
  openNotebookOptionsId: string | null = null;
  selectedNotebook: Notebook | null = null;

  selectedNotebookId: string | null = null;

  private shouldFocusTextarea = false;

  constructor(
    private store: Store,
    private eventBus: EventBusService,
    private router: Router
  ) {
    // this.isLoading$ = this.store.select(NoteSelectors.selectNotesLoading);
    // this.allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  ngOnInit(): void {
    this.eventBus.noteSelected$.subscribe((note) => {
      this.openNoteModal(note);
    });

    this.eventBus.notebookSelected$.subscribe((notebook) => {
      this.selectNotebook(notebook);
    });

    this.eventBus.notebookEditRequested$.subscribe((notebook) => {
      this.startEditingNotebook(notebook);
    });

    this.eventBus.openAddNoteModal$.subscribe(() => {
      this.showAddNoteModal = true;
    });

    this.eventBus.openAddToNotebookModal$.subscribe((note: Note) => {
      this.noteToAddToNotebook = note;
      this.showAddToNotebookModal = true;
    });

    // clears search term on every navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/') {
          this.store.dispatch(NoteActions.setSearchTerm({ term: '' }));
          this.searchTerm = ''; // Also clear the local searchTerm
        }
      });
  }

  // Focus on the textarea when modal opens (after view checked and when isEditing)
  ngAfterViewChecked(): void {
    if (this.shouldFocusTextarea && this.noteTextarea) {
      setTimeout(() => {
        this.noteTextarea.nativeElement.focus();
      });
      this.shouldFocusTextarea = false;
    }
  }

  onSearchTermChange(newSearchTerm: string) {
    this.searchTerm = newSearchTerm;
  }

  onImageLoad(index: number) {
    this.modalImageLoading[index] = false;
  }

  // NOTES methods ---------------------------------------------------
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
  }

  deleteNote(id: string) {
    if (confirm('Are you sure you want to delete the note?')) {
      this.store.dispatch(NoteActions.deleteNote({ id }));
      this.closeNoteModal();
    }
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
    this.modalImageLoading.splice(index, 1);
  }

  // MODAL methods --------------------------------------------------
  openNoteModal(note?: Note): void {
    this.selectedNote = note || {
      id: '',
      title: '',
      content: '',
      color: '#ffffff',
      pinned: false,
      createdAt: Date.now(),
      images: [],
    };
    this.isModalEditing = !note; // if new note, open in edit mode
    this.modalTitle = this.selectedNote.title;
    this.modalContent = this.selectedNote.content;
    this.modalColor = this.selectedNote?.color || '#ffffff';
    this.modalImages = [...(this.selectedNote.images || [])];
    this.modalImageLoading = new Array(this.modalImages.length).fill(false);
  }

  openNewNoteModal() {
    this.showAddNoteModal = true;
  }

  closeNoteModal(): void {
    this.selectedNote = null;
    this.isModalEditing = false;
    this.showAddNoteModal = false;
  }

  enableModalEdit(): void {
    this.isModalEditing = true;
    this.shouldFocusTextarea = true;
  }

  cancelModalEdit(): void {
    this.isModalEditing = false;
    if (this.selectedNote) {
      this.modalTitle = this.selectedNote.title;
      this.modalContent = this.selectedNote.content;
      this.modalColor = this.selectedNote.color || '#ffffff';
    }
  }

  saveModalEdit(): void {
    if (this.selectedNote) {
      const updatedNote = {
        ...this.selectedNote,
        title: this.modalTitle.trim(),
        content: this.modalContent.trim(),
        color: this.modalColor,
        images: [...this.modalImages],
        updatedAt: Date.now(), // Add update timestamp
      };

      // Create the update object for NgRx
      const update = {
        id: updatedNote.id,
        changes: {
          title: updatedNote.title,
          content: updatedNote.content,
          color: this.modalColor,
          images: updatedNote.images,
          updatedAt: updatedNote.updatedAt,
        },
      };

      // Dispatch the update to the store first
      this.store.dispatch(NoteActions.updateNote({ update }));

      // Update notebooks that contain this note using take(1) to avoid subscription issues
      this.notebooks$
        .pipe(
          map((notebooks) =>
            notebooks.filter((notebook) =>
              notebook.notes.some((note) => note.id === updatedNote.id)
            )
          ),
          // Use take(1) to automatically unsubscribe after one emission
          take(1)
        )
        .subscribe((notebooksWithNote) => {
          // Update each notebook that contains this note
          notebooksWithNote.forEach((notebook) => {
            const updatedNotebookNotes = notebook.notes.map((note) =>
              note.id === updatedNote.id ? updatedNote : note
            );

            this.store.dispatch(
              NotebookActions.updateNotebook({
                update: {
                  id: notebook.id,
                  changes: {
                    notes: updatedNotebookNotes,
                  },
                },
              })
            );
          });
        });

      // Update the local selected note
      this.selectedNote = updatedNote;
      this.isModalEditing = false;
    }
  }

  onModalImageLoad(index: number): void {
    this.modalImageLoading[index] = false;
  }

  onModalImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();

        // Add loading state for the new image
        const currentIndex = this.modalImages.length;
        this.modalImageLoading.push(true);

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.modalImages.push(reader.result);
            this.modalImageLoading[currentIndex] = false; // Mark loading as complete
          }
        };
        reader.readAsDataURL(file);
      });

      // Clears the input so the same file can be selected again if needed
      input.value = '';
    }
  }

  removeModalImage(index: number): void {
    this.modalImages.splice(index, 1);
    this.modalImageLoading.splice(index, 1);
  }

  togglePin(note: Note, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(NoteActions.togglePinNote({ id: note.id }));
  }

  // NOTEBOOKS methods ----------------------------------------------
  selectNotebook(nb: Notebook): void {
    this.selectedNotebook = nb;
    this.openNotebookOptionsId = null;
  }

  startEditingNotebook(nb: Notebook) {
    this.editingNotebook = true;

    this.editingNotebookId = nb.id;
    this.editingNotebookName = nb.name;
  }

  saveNotebookEdit() {
    if (!this.editingNotebookId) return;

    const trimmedName = this.editingNotebookName.trim();
    if (!trimmedName) {
      alert('Notebook name cannot be empty.');
      return;
    }

    this.store.dispatch(
      NotebookActions.updateNotebook({
        update: {
          id: this.editingNotebookId,
          changes: { name: this.editingNotebookName.trim() },
        },
      })
    );
    this.cancelNotebookEdit();
  }

  cancelNotebookEdit() {
    this.editingNotebook = false;
    this.editingNotebookId = null;
    this.editingNotebookName = '';
  }

  openNotebookModal() {
    this.showAddToNotebookModal = true;
  }

  closeAddToNotebookModal() {
    this.showAddToNotebookModal = false;
    this.noteToAddToNotebook = null;
  }

  handleNotebookSelected(notebook: Notebook) {
    const newNote: Note = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: Date.now(),
      pinned: false,
      color: '#fff',
      images: [],
    };

    const updatedNotes = [...notebook.notes, newNote];

    this.store.dispatch(
      NotebookActions.updateNotebook({
        update: {
          id: notebook.id,
          changes: { notes: updatedNotes },
        },
      })
    );
  }

  /* HEADER METHODS */
  onSearchChange(value: string) {
    this.searchTerm = value;
    this.store.dispatch(NoteActions.setSearchTerm({ term: value }));
  }

  removeFilter(filter: { id: string; label: string }) {
    this.activeFilters = this.activeFilters.filter((f) => f.id !== filter.id);
  }

  openCreateNotebookModal(): void {
    this.showCreateNotebookModal = true;
  }

  closeCreateNotebookModal(): void {
    this.showCreateNotebookModal = false;
  }

  onNotebookCreated(newNotebook: Notebook): void {
    this.selectedNotebook = newNotebook;
    this.showCreateNotebookModal = false;
  }
}
