import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuminosityChartComponent } from './luminosity-chart.component';

describe('LuminosityChartComponent', () => {
  let component: LuminosityChartComponent;
  let fixture: ComponentFixture<LuminosityChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LuminosityChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuminosityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
