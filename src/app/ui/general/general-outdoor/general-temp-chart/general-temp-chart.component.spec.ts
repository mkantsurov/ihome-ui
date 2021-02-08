import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTempChartComponent } from './general-temp-chart.component';

describe('GeneralTempChartComponent', () => {
  let component: GeneralTempChartComponent;
  let fixture: ComponentFixture<GeneralTempChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTempChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTempChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
