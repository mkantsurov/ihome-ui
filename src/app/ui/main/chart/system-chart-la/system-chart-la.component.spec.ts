import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemChartLaComponent } from './system-chart-la.component';

describe('SystemChartLaComponent', () => {
  let component: SystemChartLaComponent;
  let fixture: ComponentFixture<SystemChartLaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemChartLaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemChartLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
