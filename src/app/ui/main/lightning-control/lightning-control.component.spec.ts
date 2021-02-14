import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningControlComponent } from './lightning-control.component';

describe('LightningControlComponent', () => {
  let component: LightningControlComponent;
  let fixture: ComponentFixture<LightningControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightningControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightningControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
