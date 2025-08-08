import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebooksView } from './notebooks-view';

describe('NotebooksView', () => {
  let component: NotebooksView;
  let fixture: ComponentFixture<NotebooksView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebooksView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebooksView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
