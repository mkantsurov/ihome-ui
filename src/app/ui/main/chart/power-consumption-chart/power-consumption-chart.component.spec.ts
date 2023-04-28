import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerConsumptionChartComponent } from './power-consumption-chart.component';

describe('PowerChartComponent', () => {
  let component: PowerConsumptionChartComponent;
  let fixture: ComponentFixture<PowerConsumptionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerConsumptionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerConsumptionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
