import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidators {
    constructor() {}

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error.
                return null;
            }

            // test the value of the control against the regexp supplied.
            const valid = regex.test(control.value);

            // if true, return no error (no error), else return error passed in the second parameter.
            return valid ? null : error;
        };
    }
}

export class CustomValidators {

    constructor() {}

    static MatchingPasswords(control: AbstractControl) {
        const password = control.get('password').value;
        const confirmPassword = control.get('confirmPassword').value;
        const currentErrors = control.get('confirmPassword').errors
        const confirmControl = control.get('confirmPassword')

        if (compare(password, confirmPassword)) {
            confirmControl.setErrors({...currentErrors, not_matching: true});
        } else {
            confirmControl.setErrors(currentErrors)
        }
    }
}

function compare(password: string,confirmPassword: string) {
    return password !== confirmPassword && confirmPassword !== ''
}


