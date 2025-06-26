import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const hasNumber = /\d/.test(value);
        return hasNumber ? { containsNumber: true } : null;
    };
}

export const PasswordValidatorRegx: RegExp =
    /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).+$/

export function csvFileValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value;

        if (!file) return null;

        if (!(file instanceof File)) {
            return { invalidFile: true };
        }

        const isCsv = file.name.endsWith('.csv') || file.type === 'text/csv';
        if (!isCsv) {
            return { invalidFormat: true };
        }

        return null;
    };
}
