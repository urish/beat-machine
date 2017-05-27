import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentTileComponent } from './instrument-tile.component';

describe('InstrumentTileComponent', () => {
  let component: InstrumentTileComponent;
  let fixture: ComponentFixture<InstrumentTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
