import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {GroundfloorComponent} from './groundfloor.component';

describe('GroundfloorComponent', () => {
  let component: GroundfloorComponent;
  let fixture: ComponentFixture<GroundfloorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GroundfloorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundfloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
