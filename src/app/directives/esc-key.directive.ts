import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appEscKey]',
  standalone: true,
})
export class EscKeyDirective {
  @Output() appEscKey = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent | Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.appEscKey.emit();
  }
}
