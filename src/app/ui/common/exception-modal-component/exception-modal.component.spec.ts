import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionModalComponent } from './exception-modal.component';

describe('ExceptionModalComponentComponent', () => {
  let component: ExceptionModalComponent;
  let fixture: ComponentFixture<ExceptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
