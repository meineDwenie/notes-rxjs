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
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-button-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-feature.html',
  styleUrls: ['./button-feature.css'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ButtonFeatureComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() customClass = '';
  @Input() options: { label: string; action: string }[] = [];

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() optionSelected = new EventEmitter<string>();

  isOpen = false;

  private dropdownRef?: ComponentRef<DropdownMenuComponent>;

  constructor(private vcr: ViewContainerRef, private injector: Injector) {}

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();

    if (this.dropdownRef) {
      this.dropdownRef.destroy();
      this.dropdownRef = undefined;
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();

    const position = {
      x: rect.left,
      y: rect.bottom + 4,
    };

    this.dropdownRef = this.vcr.createComponent(DropdownMenuComponent, {
      injector: this.injector,
    });

    this.dropdownRef.instance.options = this.options;
    this.dropdownRef.instance.position = position;
    this.dropdownRef.instance.optionSelected.subscribe((action: string) => {
      this.optionSelected.emit(action);
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
    });
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
