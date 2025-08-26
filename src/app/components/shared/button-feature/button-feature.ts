import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
} from '@angular/core';

interface DropdownOption {
  label: string;
  action: string;
}

@Component({
  selector: 'app-button-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-feature.html',
  styleUrls: ['./button-feature.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ButtonFeatureComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() customClass: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() hasDropdown: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() optionSelected = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) {}

  onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.clicked.emit(event);
  }
}
