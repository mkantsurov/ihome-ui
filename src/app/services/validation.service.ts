import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    constructor() {
    }

    newPasswordsValidator(group: FormGroup): any {
        if (group.controls.newPassword.pristine && group.controls.repeatedNewPassword.pristine) {
            return null;
        }
        if (!group.controls.newPassword.value) {
            return null;
        }
        if (!group.controls.repeatedNewPassword.value) {
            return null;
        }
        if ((group.controls.newPassword.value === group.controls.repeatedNewPassword.value) &&
            group.controls.repeatedNewPassword.dirty) {
            return null;
        }
        return {unmatchedPasswords: true};
    }

    minSelectedCheckboxesValidator(min = 1): any {
        const validator: ValidatorFn = (formArray: FormArray) => {
            const totalTouched = formArray.controls
                .map(control => control.touched)
                .reduce((prev, next) => prev || next);

            if (!totalTouched) {
                return null;
            }

            const totalSelected = formArray.controls
                // get a list of checkbox values (boolean)
                .map(control => control.value)
                // total up the number of checked checkboxes
                .reduce((prev, next) => next ? prev + next : prev, 0);
            // if the total is not greater than the minimum, return the error message
            return totalSelected >= min ? null : {notEnoughValues: min};
        };

        return validator;
    }

    currentNewPasswordValidator(group: FormGroup): any {
        if ((group.controls.currentPassword.value === group.controls.newPassword.value) &&
            group.controls.currentPassword.value &&
            group.controls.newPassword.value
        ) {
            return {matchedCurrentAndNewPasswords: true};
        }
        return null;
    }

    passwordUpperLowerCaseValidator(control: AbstractControl): any {
        if (!control || !control.value) {
            return null;
        }
        if (control.value.match(/(?=.*[A-Z])(?=.*[a-z])/)) {
            return null;
        }
        return {invalidUpperLowerCaseRestriction: true};
    }

    passwordLettersNumbersValidator(control: AbstractControl): any {
        if (!control || !control.value) {
            return null;
        }
        if (control.value.match(/(?=.*\d)(?=.*[a-zA-Z])/)) {
            return null;
        }
        return {invalidLetterNumberRestriction: true};
    }

    passwordSpecialCharValidator(control: AbstractControl): any {
        if (!control || !control.value) {
            return null;
        }
        if (control.value.match(/(?=.*\W)/)) {
            return null;
        }
        return {invalidSpecialCharRestriction: true};
    }

    passwordFormValidator(group: AbstractControl, value: string, firstParam: boolean,
                          secondParam: boolean, thirdParam: boolean, passMinLen: number): any {
        if (firstParam) {
            group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen),
                Validators.maxLength(50), this.passwordUpperLowerCaseValidator]);
            if (secondParam) {
                group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen), Validators.maxLength(50),
                    this.passwordUpperLowerCaseValidator, this.passwordLettersNumbersValidator]);
                if (thirdParam) {
                    group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen), Validators.maxLength(50),
                        this.passwordUpperLowerCaseValidator, this.passwordLettersNumbersValidator, this.passwordSpecialCharValidator]);
                }
            } else if (thirdParam) {
                group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen), Validators.maxLength(50),
                    this.passwordUpperLowerCaseValidator, this.passwordSpecialCharValidator]);
            }
        }
        if (!firstParam && secondParam) {
            group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen),
                Validators.maxLength(50), this.passwordLettersNumbersValidator]);
            if (thirdParam) {
                group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen), Validators.maxLength(50),
                    this.passwordLettersNumbersValidator, this.passwordSpecialCharValidator]);
            }
        }
        if (!firstParam && !secondParam && thirdParam) {
            group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen),
                Validators.maxLength(50), this.passwordSpecialCharValidator]);
        }
        if (!firstParam && !secondParam && !thirdParam) {
            group.get(value)?.setValidators([Validators.required, Validators.minLength(passMinLen), Validators.maxLength(50)]);
        }
        group.get(value)?.updateValueAndValidity();
    }

    emailValidator(control): any {
        // validation from PatternFactory
        return control.value?.match('^([\\w!#$%&\'*+/=?^_`{|}~\u0080-\uFFFF-]+|"'
            + '([\\w!#$%&\'*.(),<>\\[\\]:; @+/=?^_`{|}~\u0080-\uFFFF-]|\\\\\\\\|\\\\")+")'
            + '(\\.([\\w!#$%&\'*+/=?^_`{|}~\u0080-\uFFFF-]+|"'
            + '([\\w!#$%&\'*.(),<>\\[\\]:; @+/=?^_`{|}~\u0080-\uFFFF-]|\\\\\\\\|\\\\")+"))*'
            + '[@]\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$') ? null : {email: true};
    }


    // uniqueEmailValidator(control: FormControl): Promise<ValidationErrors | null> {
    //     if (!control || !control.value) {
    //         return null;
    //     }
    //
    //     return this.userService.checkMail(control.value).then(value => {
    //         return value ? {notUniqueEmail: true} : null;
    //     });
    // }

    // uniqueUsernameValidator(control: FormControl): any {
    //     if (!control || !control.value) {
    //         return of(null);
    //     }
    //     return this.userService.availableUserName(control.value).then(
    //         response => {
    //             const uniqueUsername: boolean = response;
    //             return uniqueUsername === false ? {notUniqueUsername: true} : null;
    //         });
    // }

    passwordValidator(control: AbstractControl): any {
        if (!control || !control.value) {
            return null;
        }
        if (control.value.match(/^.*[0-9].*$/)) {
            return null;
        }
        return {invalidPassword: true};
    }

    // {1,50}           - FirstName, Last Name, Account Status
    simpleTextFieldValidator(control: FormControl): any {
        if (!control || !control.value) {
            return null;
        }

        if (control.value.match(/^[A-Za-z]{1,50}$/)) {
            return null;
        }
        return {invalidTextValue: true};
    }


    // {1,100}           - Support Name
    simpleTextFieldWithSpacesAndNumbersValidator(control: FormControl): any {
        if (!control || !control.value) {
            return null;
        }

        if (control.value.match(/^([A-Za-z0-9]\s*){1,255}$/)) {
            return null;
        }
        return {invalidTextValueWithSpacesAndNumbers: true};
    }

    // {1,255}           - Address, Primary Contact Name
    longTextFieldValidator(control: FormControl): any {
        if (!control || !control.value) {
            return null;
        }

        if (control.value.match(/^\s*([^\s]\s*){0,255}$/)) {
            return null;
        }
        return {invalidLongTextValue: true};
    }

    // 5-30 strings without spaces
    loginValidator(control: FormControl): any {
        if (!control || !control.value) {
            return null;
        }
        if (control.value.match(/^[\w]{5,30}$/)) {
            return null;
        }
        return {invalidLogin: true};
    }

    // allowed symbols
    phonedSymbolsValidator(control: FormControl): any {
        if (!control || !control.value) {
            return null;
        }

        if (control.value.match(/^\+?\d*(\s|-)?((\(\d+\))?|\d+)(\s|-)?\d+(\s|-)?\d+(\s|-)?\d+$/)) {
            return null;
        }
        return {invalidPhoneNumberSymbols: true};
    }

    numberValidator(c: FormControl): any {
        const val = c.value;
        if (val == null || val === '') {
            return null;

        }
        if (RegExp('^[0-9]+$').test(c.value)) {
            return null;
        }
        return {nan: true};
    }

    negativeNumberValidator(c: FormControl): any {
        const val = c.value;
        if (val == null || val === '') {
            return null;
        }
        if (val > 0) {
            return null;
        }
        return {negative: true};
    }

    integerNumberValidator(c: FormControl): any {
        const val = c.value;
        if (val == null || val === '') {
            return null;

        }
        if (!Number.isInteger(val)) {
            return {integer: val};
        }
        return null;
    }

    checkDateRangeValidator(group: FormGroup): any {
        if (group.controls.startDate.value == null || group.controls.startDate.value === ''
            || group.controls.endDate.value == null || group.controls.endDate.value === '') {
            return null;
        } else if (group.controls.startDate.value > group.controls.endDate.value) {
            return {incorrectDateRange: true};
        } else {
            return null;
        }
    }

    checkDateTimeFrameValidator(group: FormGroup): any {
        if (group.controls.startDate.value == null || group.controls.startDate.value === ''
            || group.controls.endDate.value == null || group.controls.endDate.value === '') {
            return null;
        }
        const diff = Math.floor(group.controls.endDate.value - group.controls.startDate.value);
        const day = 1000 * 60 * 60 * 24;
        const days = Math.floor(diff / day);
        if ((days + 1) > 365) {
            return {incorrectTimeFrame: true};
        } else {
            return null;
        }
    }


    // comparison with restriction  on Java Integer.MAX_VALUE = 2147483647
    maxIntValidator(control: FormControl): { maxInt: any } {
        const maxValue = 2147483647; // Java Integer.MAX_VALUE
        return control.value > maxValue ? {maxInt: control.value} : null;
    }

    passwordMatchValidator(controlName: string, matchingControlName: string) {
        return (group: AbstractControl) => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if (!control || !matchingControl) {
                return null;
            }
            if (control.value.length === 0 || matchingControl.value.length === 0) {
                return null;
            }
            // return if another validator has already found an error on the matchingControl
            if (matchingControl.errors && !matchingControl.errors.passwordMatchValidator) {
                return null;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({unmatchedPasswords: true});
            } else {
                matchingControl.setErrors(null);
            }
            return null;
        }
    }
}

export function getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const configErrorMsg = {
        required: 'Required field.',
        email: 'Invalid email address.',
        notUniqueEmail: 'Email already exists.',
        notUniqueUsername: 'Username already exists.',
        notUniqueOrgName: 'Organization name already exists.',
        invalidPassword: 'Password must contain a digit.',
        invalidUpperLowerCaseRestriction: 'Password must contain upper/lower case letters.',
        invalidLetterNumberRestriction: 'Password must contain letters and numbers.',
        invalidSpecialCharRestriction: 'Password must contain special characters.',
        invalidUsername: 'Must be at least 4 characters long, starts with alphabet, and contain alphanumerics. Max: 30 characters.',
        minlength: `Minimum length ${validatorValue.requiredLength} symbols.`,
        maxlength: `Maximum length ${validatorValue.requiredLength} symbols.`,
        unmatchedPasswords: `New passwords must be the same.`,
        matchedCurrentAndNewPasswords: `Current and new passwords must be different.`,
        invalidTextValue: 'Must be only 1-50 letters without spaces.',
        invalidTextValueWithSpacesAndNumbers: 'Must be only 1-255 letters with numbers.',
        invalidLongTextValue: 'Must be only 1-255 characters',
        invalidPhoneNumberSymbols: 'Wrong format! Please use one of the following: +XX XX XXX XXXX, (XXX) XXX XXXX, +XX-XXXX-XXXXXX.',
        invalidLogin: 'Only 5-30 letters, digits or \'_\' allowed.',
        nan: 'Please enter a valid value.',
        min: `Value must be greater or equal ${validatorValue.min}.`,
        max: `Value must be less or equal ${validatorValue.max}.`,
        maxInt: `Off range.`,
        integer: `Please enter a valid value. Nearest values: ${Math.floor(validatorValue)} and ${Math.ceil(validatorValue)}.`,
        rangeFrom: 'From value more than To value.',
        rangeTo: 'To value less than From value.',
        availableBalanceValidator: `${validatorValue}.`,
        durationYears: 'Duration period must be less or equal to 20 years.',
        durationMonths: 'Duration period must be less or equal to 240 months.',
        durationDays: 'Duration period must be less or equal to 7300 days.',
        durationMinValue: 'Duration period must be greater than 0.'
    };
    return configErrorMsg[validatorName];
}
