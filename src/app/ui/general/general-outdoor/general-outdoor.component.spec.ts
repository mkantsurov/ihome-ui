import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOutdoorComponent } from './general-outdoor.component';

describe('GeneralOutdoorComponent', () => {
  let component: GeneralOutdoorComponent;
  let fixture: ComponentFixture<GeneralOutdoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralOutdoorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOutdoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
