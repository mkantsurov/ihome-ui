import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoilerTempChartComponent } from './boiler-temp-chart.component';

describe('BoilerTempChartComponent', () => {
  let component: BoilerTempChartComponent;
  let fixture: ComponentFixture<BoilerTempChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoilerTempChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoilerTempChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
