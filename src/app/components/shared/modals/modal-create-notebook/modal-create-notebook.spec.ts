import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateNotebookComponent } from './modal-create-notebook';

describe('ModalCreateNotebookComponent', () => {
  let component: ModalCreateNotebookComponent;
  let fixture: ComponentFixture<ModalCreateNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateNotebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
