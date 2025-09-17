import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableCheckboxesComponent } from './draggable-checkboxes.component';

describe('DraggableCheckboxesComponent', () => {
  let component: DraggableCheckboxesComponent;
  let fixture: ComponentFixture<DraggableCheckboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCheckboxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
