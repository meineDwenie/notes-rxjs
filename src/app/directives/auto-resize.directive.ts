import {
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
})
export class AutoResizeDirective implements AfterViewInit, OnChanges {
  @Input() ngModel: string = ''; // <-- bind to the ngModel content
  private maxHeight = 500;

  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  @HostListener('input')
  adjustHeight() {
    const textarea = this.el.nativeElement;

    textarea.style.height = 'auto'; // Reset first
    textarea.style.height =
      Math.min(textarea.scrollHeight, this.maxHeight) + 'px';
  }

  ngAfterViewInit() {
    setTimeout(() => this.adjustHeight(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('ngModel' in changes) {
      setTimeout(() => this.adjustHeight(), 0);
    }
  }
}
