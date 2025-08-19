import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditNotebookComponent } from './modal-edit-notebook.component';

describe('ModalEditNotebookComponent', () => {
  let component: ModalEditNotebookComponent;
  let fixture: ComponentFixture<ModalEditNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditNotebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
