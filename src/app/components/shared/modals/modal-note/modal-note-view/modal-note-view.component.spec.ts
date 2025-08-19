import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteViewComponent } from './modal-note-view.component';

describe('ModalNoteViewComponent', () => {
  let component: ModalNoteViewComponent;
  let fixture: ComponentFixture<ModalNoteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNoteViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
