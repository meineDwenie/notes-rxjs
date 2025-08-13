import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddNewNoteComponent } from './modal-add-new-note';

describe('ModalAddNewNoteComponent', () => {
  let component: ModalAddNewNoteComponent;
  let fixture: ComponentFixture<ModalAddNewNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddNewNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddNewNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
