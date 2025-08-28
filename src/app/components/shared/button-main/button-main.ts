import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  Injector,
  ComponentRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

@Component({
  selector: 'app-button-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-main.html',
  styleUrls: ['./button-main.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ButtonMainComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() customClass = '';
  @Input() options: { label: string; action: string }[] = [];

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() optionSelected = new EventEmitter<string>();

  isOpen = false;

  constructor(private vcr: ViewContainerRef, private injector: Injector) {}

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  onSelect(action: string, event: MouseEvent) {
    event.stopPropagation();
    this.optionSelected.emit(action);
    this.isOpen = false;
  }

  closeMenu() {
    this.isOpen = false;
  }
}
