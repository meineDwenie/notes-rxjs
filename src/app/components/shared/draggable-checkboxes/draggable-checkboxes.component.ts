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
    // Create mutable copies of the checkboxes
    this.sortedCheckboxes = this.checkboxes
      .map((cb) => ({ ...cb }))
      .sort((a, b) => a.order - b.order);
  }

  ngOnChanges() {
    // Create mutable copies of the checkboxes
    this.sortedCheckboxes = this.checkboxes
      .map((cb) => ({ ...cb }))
      .sort((a, b) => a.order - b.order);
  }

  addNewCheckbox() {
    const newCheckbox: CheckboxItem = {
      id: Date.now().toString(),
      text: '',
      checked: false,
      order: this.sortedCheckboxes.length,
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
    // Create a new array with updated checkbox
    this.sortedCheckboxes = this.sortedCheckboxes.map((cb) =>
      cb.id === id ? { ...cb, checked: !cb.checked } : cb
    );
    this.emitChanges();
  }

  updateCheckboxText(id: string, text: string) {
    // Create a new array with updated checkbox
    this.sortedCheckboxes = this.sortedCheckboxes.map((cb) =>
      cb.id === id ? { ...cb, text: text.trim() } : cb
    );
    this.emitChanges();
  }

  // Handle real-time text updates
  onTextInput(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Text input changed:', id, input.value);

    // Create a new array with updated checkbox
    this.sortedCheckboxes = this.sortedCheckboxes.map((cb) =>
      cb.id === id ? { ...cb, text: input.value } : cb
    );
    this.emitChanges();
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
      const draggedItem = { ...this.sortedCheckboxes[this.draggingIndex] };

      // Create new array without the dragged item
      const withoutDragged = this.sortedCheckboxes.filter(
        (_, index) => index !== this.draggingIndex
      );

      // Insert at new position
      const targetIndex =
        dropIndex > this.draggingIndex ? dropIndex - 1 : dropIndex;
      this.sortedCheckboxes = [
        ...withoutDragged.slice(0, targetIndex),
        draggedItem,
        ...withoutDragged.slice(targetIndex),
      ];

      this.reorderCheckboxes();
      this.emitChanges();
    }
  }

  onDragEnd() {
    this.draggingIndex = -1;
  }

  private reorderCheckboxes() {
    // Create new array with updated order
    this.sortedCheckboxes = this.sortedCheckboxes.map((checkbox, index) => ({
      ...checkbox,
      order: index,
    }));
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
