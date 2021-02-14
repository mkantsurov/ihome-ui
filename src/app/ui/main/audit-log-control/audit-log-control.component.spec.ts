import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogControlComponent } from './audit-log-control.component';

describe('AuditLogControlComponent', () => {
  let component: AuditLogControlComponent;
  let fixture: ComponentFixture<AuditLogControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditLogControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
