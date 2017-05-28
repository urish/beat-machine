import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotConnectorComponent } from './robot-connector.component';

describe('RobotConnectorComponent', () => {
  let component: RobotConnectorComponent;
  let fixture: ComponentFixture<RobotConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobotConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
