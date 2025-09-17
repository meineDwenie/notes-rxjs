import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { EventBusService } from '../../services/event-bus.service';
import { ButtonFeatureComponent } from '../shared/button-feature/button-feature';

import { Note } from '../../notes/note.model';
import { Notebook } from '../../notebooks/notebook.model';
import * as NotebookSelectors from '../../notebooks/notebook.selectors';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, ButtonFeatureComponent],
  templateUrl: './note.html',
  styleUrls: ['./note.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NoteComponent {
  @Input() note!: Note;

  @Output() open = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();
  @Output() togglePin = new EventEmitter<{ note: Note; event: MouseEvent }>();
  @Output() addToNotebook = new EventEmitter<Note>();
  @Output() removeFromNotebook = new EventEmitter<{
    noteId: string;
    notebookId: string;
  }>();
  @Output() imageUpload = new EventEmitter<{
    noteId: string;
    images: string[];
  }>();
  @Output() showCheckboxes = new EventEmitter<Note>();
  @Output() addCheckboxes = new EventEmitter<Note>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  notebooks$: Observable<Notebook[]>;
  isInNotebook$!: Observable<boolean>;
  containingNotebook$!: Observable<Notebook | undefined>;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  ngOnInit() {
    // Check if this note is in any notebook
    this.isInNotebook$ = this.notebooks$.pipe(
      map((notebooks) =>
        notebooks.some((notebook) =>
          notebook.notes.some((note) => note.id === this.note.id)
        )
      )
    );

    // Get the notebook that contains this note
    this.containingNotebook$ = this.notebooks$.pipe(
      map((notebooks) =>
        notebooks.find((notebook) =>
          notebook.notes.some((note) => note.id === this.note.id)
        )
      )
    );
  }

  onOpen() {
    this.open.emit(this.note);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.note.id);
  }

  onTogglePin(event: MouseEvent) {
    this.togglePin.emit({ note: this.note, event });
  }

  /* NOTEBOOK Methods */
  openAddToNotebookModal(note: Note) {
    this.eventBus.triggerAddToNotebookModal(note);
  }

  onRemoveFromNotebook(event: MouseEvent) {
    event.stopPropagation();
    // Get the notebook ID from the observable using take(1) to avoid memory leaks
    this.containingNotebook$.pipe(take(1)).subscribe((notebook) => {
      if (notebook) {
        this.removeFromNotebook.emit({
          noteId: this.note.id,
          notebookId: notebook.id,
        });
      }
    });
  }

  /* IMAGE Methods */
  triggerImageUpload(event: MouseEvent) {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const newImages: string[] = [];
      let filesProcessed = 0;
      const totalFiles = input.files.length;

      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
          }

          filesProcessed++;
          if (filesProcessed === totalFiles) {
            // All files processed, emit the upload event
            this.imageUpload.emit({
              noteId: this.note.id,
              images: newImages,
            });
          }
        };

        reader.readAsDataURL(file);
      });

      input.value = '';
    }
  }

  /* CHECKBOX Methods */
  onAddCheckboxes(event: MouseEvent) {
    event?.stopPropagation();

    this.eventBus.openNoteInEditMode(this.note, true); // true indicates to add checkboxes
  }

  addCheckboxesToContent(content: string): string {
    const lines = content.split('\n');
    const checkboxLines = lines.map((line) => {
      if (line.trim()) {
        return `☐ ${line}`;
      }
      return line;
    });
    return checkboxLines.join('\n');
  }

  toggleCheckbox(content: string, lineIndex: number): string {
    const lines = content.split('\n');
    if (lines[lineIndex]) {
      if (lines[lineIndex].startsWith('☐')) {
        lines[lineIndex] = lines[lineIndex].replace('☐', '☑');
      } else if (lines[lineIndex].startsWith('☑')) {
        lines[lineIndex] = lines[lineIndex].replace('☑', '☐');
      }
    }
    return lines.join('\n');
  }
}