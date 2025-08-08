import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashView } from './trash-view';

describe('TrashView', () => {
  let component: TrashView;
  let fixture: ComponentFixture<TrashView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
