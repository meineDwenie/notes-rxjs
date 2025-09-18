import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

@Component({
  selector: 'app-draggable-checkboxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draggable-checkboxes.component.html',
  styleUrl: './draggable-checkboxes.component.css',
})
export class DraggableCheckboxesComponent implements OnInit {
  @Input() checkboxes: CheckboxItem[] = [];

  @Output() checkboxesChange = new EventEmitter<CheckboxItem[]>();

  sortedCheckboxes: CheckboxItem[] = [];
  draggingIndex: number = -1;

  ngOnInit() {
    this.sortedCheckboxes = [...this.checkboxes].sort(
      (a, b) => a.order - b.order
    );
  }

  ngOnChanges() {
    this.sortedCheckboxes = [...this.checkboxes].sort(
      (a, b) => a.order - b.order
    );
  }

  addNewCheckbox() {
    const newCheckbox: CheckboxItem = {
      id: Date.now().toString(),
      text: '',
      checked: false,
      order: this.checkboxes.length,
    };

    this.sortedCheckboxes.push(newCheckbox);
    this.emitChanges();

    // Focus the new input after a short delay
    setTimeout(() => {
      const inputs = document.querySelectorAll('.checkbox-text-input');
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    }, 100);
  }

  toggleCheckbox(id: string) {
    const checkbox = this.sortedCheckboxes.find((cb) => cb.id === id);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      this.emitChanges();
    }
  }

  updateCheckboxText(id: string, text: string) {
    const checkbox = this.sortedCheckboxes.find((cb) => cb.id === id);
    if (checkbox) {
      checkbox.text = text.trim();
      this.emitChanges();
    }
  }

  // New method to handle real-time text updates
  onTextInput(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checkbox = this.sortedCheckboxes.find((cb) => cb.id === id);
    if (checkbox) {
      console.log('Text input changed:', id, input.value);
      checkbox.text = input.value;
      this.emitChanges();
    }
  }

  removeCheckbox(id: string) {
    this.sortedCheckboxes = this.sortedCheckboxes.filter((cb) => cb.id !== id);
    this.reorderCheckboxes();
    this.emitChanges();
  }

  deleteIfEmpty(checkbox: CheckboxItem, event: KeyboardEvent) {
    if (
      event.key === 'Backspace' &&
      checkbox.text.trim() === '' &&
      this.sortedCheckboxes.length > 1
    ) {
      this.removeCheckbox(checkbox.id);
    }
  }

  onDragStart(event: DragEvent, index: number) {
    this.draggingIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', index.toString());
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();

    if (this.draggingIndex !== -1 && this.draggingIndex !== dropIndex) {
      const draggedItem = this.sortedCheckboxes[this.draggingIndex];

      // Remove the dragged item
      this.sortedCheckboxes.splice(this.draggingIndex, 1);

      // Insert it at the new position
      if (dropIndex > this.draggingIndex) {
        this.sortedCheckboxes.splice(dropIndex - 1, 0, draggedItem);
      } else {
        this.sortedCheckboxes.splice(dropIndex, 0, draggedItem);
      }

      this.reorderCheckboxes();
      this.emitChanges();
    }
  }

  onDragEnd() {
    this.draggingIndex = -1;
  }

  private reorderCheckboxes() {
    this.sortedCheckboxes.forEach((checkbox, index) => {
      checkbox.order = index;
    });
  }

  private emitChanges() {
    console.log('Emitting checkbox changes:', this.sortedCheckboxes);
    this.checkboxesChange.emit([...this.sortedCheckboxes]);
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;
    input.blur();
  }

  onKeyup(event: Event, checkbox: CheckboxItem) {
    const keyboardEvent = event as KeyboardEvent;
    if (
      keyboardEvent.key === 'Backspace' &&
      checkbox.text.trim() === '' &&
      this.sortedCheckboxes.length > 1
    ) {
      this.removeCheckbox(checkbox.id);
    }
  }
}
