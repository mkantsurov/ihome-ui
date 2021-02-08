import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPowerChartComponent } from './general-power-chart.component';

describe('GeneralPowerChartComponent', () => {
  let component: GeneralPowerChartComponent;
  let fixture: ComponentFixture<GeneralPowerChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPowerChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPowerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
