import { ErrorViewDirective } from './error-view.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('ErrorViewDirective', () => {
  it('should create an instance', () => {
    const directive = new ErrorViewDirective(
      {} as ViewContainerRef,
      {} as TemplateRef<any>
    );
    expect(directive).toBeTruthy();
  });
});
