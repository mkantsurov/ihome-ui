import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPowerComponent } from './general-power.component';

describe('GeneralPowerComponent', () => {
  let component: GeneralPowerComponent;
  let fixture: ComponentFixture<GeneralPowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
