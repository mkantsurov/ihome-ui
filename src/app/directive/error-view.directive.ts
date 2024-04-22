import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {getValidatorErrorMessage} from '../services/validation.service';

@Directive({
    selector: '[appErrorView]',
    standalone: true
})
export class ErrorViewDirective {

    private context: AppErrorViewContext = new AppErrorViewContext();
    private thenTemplateRef: TemplateRef<AppErrorViewContext> | null = null;
    private thenViewRef: EmbeddedViewRef<AppErrorViewContext> | null = null;

    constructor(private viewContainer: ViewContainerRef, templateRef: TemplateRef<AppErrorViewContext>) {
        this.thenTemplateRef = templateRef;
    }

    @Input()
    set appErrorView(errors: ValidationErrors) {
        this.context.$implicit = errors;
        for (const validator in errors) {
            // console.log(`Error: ${validator}`);
            if (errors.hasOwnProperty(validator)) {
                this.context.errorMessage = getValidatorErrorMessage(validator, errors[validator]);
                break;
            }
        }
        this.updateView();
    }

    private updateView(): void {
        if (this.context.$implicit) {
            if (!this.thenViewRef) {
                this.viewContainer.clear();
                if (this.thenTemplateRef) {
                    this.thenViewRef =
                        this.viewContainer.createEmbeddedView(this.thenTemplateRef, this.context);
                }
            }
        }
    }

}

export class AppErrorViewContext {
    public $implicit: ValidationErrors = null;
    public errorMessage = null;
}
