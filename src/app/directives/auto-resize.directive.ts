import {
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
})
export class autoResizeDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  @HostListener('input')
  adjustHeight() {
    const textarea = this.el.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px'; // Max 400px
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.adjustHeight();
    });
  }
}
