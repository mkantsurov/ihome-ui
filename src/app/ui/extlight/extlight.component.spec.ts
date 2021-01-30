import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ExtlightComponent} from './extlight.component';

describe('ExtlightComponent', () => {
  let component: ExtlightComponent;
  let fixture: ComponentFixture<ExtlightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtlightComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
