import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent {
  @Input() currentView = '';
  @Input() searchTerm = '';
  @Input() viewMode: 'grid' | 'column' = 'grid';
  @Input() activeFilters: Array<{ id: string; label: string }> = [];

  @Output() createNote = new EventEmitter<void>();
  @Output() createNotebook = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterRemove = new EventEmitter<{ id: string; label: string }>();

  onCreateNote() {
    this.createNote.emit();
  }

  onCreateNotebook() {
    this.createNotebook.emit();
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchChange.emit(value);
  }

  clearSearch() {
    this.onSearchChange('');
  }

  removeFilter(filter: { id: string; label: string }) {
    this.filterRemove.emit(filter);
  }
}
