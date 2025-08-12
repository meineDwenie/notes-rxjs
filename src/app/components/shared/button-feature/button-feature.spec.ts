import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonFeatureComponent } from './button-feature';

describe('ButtonFeatureComponent', () => {
  let component: ButtonFeatureComponent;
  let fixture: ComponentFixture<ButtonFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
