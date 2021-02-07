import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSignInComponent } from './general-sign-in.component';

describe('GeneralSignInComponent', () => {
  let component: GeneralSignInComponent;
  let fixture: ComponentFixture<GeneralSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralSignInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
