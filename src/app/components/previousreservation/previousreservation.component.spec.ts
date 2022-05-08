import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousreservationComponent } from './previousreservation.component';

describe('PreviousreservationComponent', () => {
  let component: PreviousreservationComponent;
  let fixture: ComponentFixture<PreviousreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousreservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
