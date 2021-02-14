import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TempChartComponent} from './temp-chart.component';

describe('TempChartComponent', () => {
  let component: TempChartComponent;
  let fixture: ComponentFixture<TempChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TempChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
