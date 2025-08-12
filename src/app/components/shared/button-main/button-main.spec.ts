import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonMainComponent } from './button-main';

describe('ButtonMainComponent', () => {
  let component: ButtonMainComponent;
  let fixture: ComponentFixture<ButtonMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
