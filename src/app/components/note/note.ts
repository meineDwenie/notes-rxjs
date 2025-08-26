import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
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
  @Output() optionSelected = new EventEmitter<string>();
  @Output() addToNotebook = new EventEmitter<Note>();
  @Output() showCheckboxes = new EventEmitter<Note>();
  @Output() addCheckboxes = new EventEmitter<Note>();

  notebooks$: Observable<Notebook[]>;

  dropdownVisible: boolean = false;

  constructor(private store: Store, private eventBus: EventBusService) {
    this.notebooks$ = this.store.select(NotebookSelectors.selectAllNotebooks);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.dropdownVisible = false;
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

  openAddToNotebookModal(note: Note) {
    this.eventBus.triggerAddToNotebookModal(note);
  }

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Dropdown toggled');
    this.dropdownVisible = !this.dropdownVisible;
  }

  onOptionSelected(action: string) {
    switch (action) {
      case 'addToNotebook':
        this.optionSelected.emit('addToNotebook');
        this.addToNotebook.emit(this.note);
        break;
      case 'delete':
        this.onDelete({ stopPropagation: () => {} } as MouseEvent);
        break;
      case 'showCheckboxes':
        this.showCheckboxes.emit(this.note);
        break;
      case 'addCheckboxes':
        this.addCheckboxes.emit(this.note);
        break;
    }
  }

  // Function to add checkboxes to note content
  addCheckboxesToContent(content: string): string {
    // Split content by lines and add checkboxes to each line
    const lines = content.split('\n');
    const checkboxLines = lines.map((line) => {
      if (line.trim()) {
        return `☐ ${line}`;
      }
      return line;
    });
    return checkboxLines.join('\n');
  }

  // Function to toggle checkbox state
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
