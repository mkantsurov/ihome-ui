import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPressureChartComponent } from './general-pressure-chart.component';

describe('GeneralPressureChartComponent', () => {
  let component: GeneralPressureChartComponent;
  let fixture: ComponentFixture<GeneralPressureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPressureChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPressureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
