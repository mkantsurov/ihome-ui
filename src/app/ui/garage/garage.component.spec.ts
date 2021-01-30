import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {GarageComponent} from './garage.component';

describe('GarageComponent', () => {
  let component: GarageComponent;
  let fixture: ComponentFixture<GarageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GarageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
