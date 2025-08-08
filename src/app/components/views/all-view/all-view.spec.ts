import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllView } from './all-view';

describe('AllView', () => {
  let component: AllView;
  let fixture: ComponentFixture<AllView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
