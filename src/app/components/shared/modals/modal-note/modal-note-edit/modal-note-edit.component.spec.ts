import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteEditComponent } from './modal-note-edit.component';

describe('ModalNoteEditComponent', () => {
  let component: ModalNoteEditComponent;
  let fixture: ComponentFixture<ModalNoteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNoteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
