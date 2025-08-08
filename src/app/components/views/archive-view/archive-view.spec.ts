import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveView } from './archive-view';

describe('ArchiveView', () => {
  let component: ArchiveView;
  let fixture: ComponentFixture<ArchiveView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
