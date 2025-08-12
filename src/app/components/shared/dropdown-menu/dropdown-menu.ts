import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.css'],
})
export class DropdownMenuComponent {
  @Input() options: { label: string; action: string }[] = [];
  @Input() position = { x: 0, y: 0 };
  @Output() optionSelected = new EventEmitter<string>();

  onSelect(action: string) {
    this.optionSelected.emit(action);
  }
}
