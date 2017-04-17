import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatIndicatorComponent } from './beat-indicator.component';

describe('BeatIndicatorComponent', () => {
  let component: BeatIndicatorComponent;
  let fixture: ComponentFixture<BeatIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeatIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
