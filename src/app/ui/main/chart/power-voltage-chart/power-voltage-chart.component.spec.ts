import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerVoltageChartComponent } from './power-voltage-chart.component';

describe('PowerChartComponent', () => {
  let component: PowerVoltageChartComponent;
  let fixture: ComponentFixture<PowerVoltageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerVoltageChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerVoltageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
