import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddToNotebookComponent } from './modal-add-to-notebook';

describe('ModalAddToNotebookComponent', () => {
  let component: ModalAddToNotebookComponent;
  let fixture: ComponentFixture<ModalAddToNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddToNotebookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddToNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
