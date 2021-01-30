import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PressureChartComponent} from './pressure-chart.component';

describe('PressureChartComponent', () => {
  let component: PressureChartComponent;
  let fixture: ComponentFixture<PressureChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PressureChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
