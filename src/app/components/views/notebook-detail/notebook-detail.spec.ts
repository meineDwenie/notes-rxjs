import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookDetail } from './notebook-detail';

describe('NotebookDetail', () => {
  let component: NotebookDetail;
  let fixture: ComponentFixture<NotebookDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebookDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
