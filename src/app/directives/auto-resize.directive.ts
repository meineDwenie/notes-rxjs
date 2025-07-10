import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
})
export class autoResizeDirective {
  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  @HostListener('input')
  adjustHeight() {
    const textarea = this.el.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px'; // Max 300px
  }
}
