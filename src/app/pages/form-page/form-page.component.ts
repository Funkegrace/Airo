import { Component } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormDataService } from '../../services/form-data.service';
import { ClearDialogComponent } from '../../shared/components/clear-dialog/clear-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPlans } from '../../shared/literals';
import { CsvInterface } from '../../shared/interfaces/csv.interface';
import { FormDataInterfaceForLocalStorage } from '../../shared/interfaces/form-data.interface';
import { csvFileValidator, noNumbersValidator, PasswordValidatorRegx } from '../../Validators/custom-validator';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatIconModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss'
})
export class FormPageComponent {
  public myForm: FormGroup;
  public readonly subscriptions: SubscriptionPlans[] = [SubscriptionPlans.BASIC, SubscriptionPlans.ADVANCED, SubscriptionPlans.PRO];
  public hide: boolean = true;
  private readonly csvHeaders: string[] = ['Name', 'Surname', 'Age', 'City', 'Address'];
  public errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formDataService: FormDataService,
    public dialog: MatDialog
  ) {
    this.myForm = this.fb.group({
      firstName: ['', [noNumbersValidator()]],
      lastName: ['', [noNumbersValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            PasswordValidatorRegx
          ), Validators.maxLength(8),
          Validators.minLength(8)
        ],
      ],

      subscription: [SubscriptionPlans.ADVANCED, Validators.required],
      csvFile: ['', [csvFileValidator()]]
    });
  }

  get myFormControls() {
    return this.myForm.controls;
  }

  collectFormErrors(): string[] {
    const errors: string[] = [];
    const controls = this.myForm.controls;
  
    if (controls['firstName']?.hasError('required')) {
      errors.push('First name is required.');
    }
  
    if (controls['firstName']?.hasError('containsNumber')) {
      errors.push('First name should not contain numbers.');
    }
  
    if (controls['lastName']?.hasError('required')) {
      errors.push('Last name is required.');
    }
  
    if (controls['lastName']?.hasError('containsNumber')) {
      errors.push('Last name should not contain numbers.');
    }
  
    if (controls['email']?.hasError('required')) {
      errors.push('Email is required.');
    } else if (controls['email']?.hasError('email')) {
      errors.push('Email format is invalid.');
    }
  
    if (controls['password']?.hasError('required') || controls['password']?.hasError('pattern') || controls['password']?.hasError('minlength') || controls['password']?.hasError('maxlength')) {
      errors.push('Password is required.');
    } else if (controls['password']?.hasError('pattern')) {
      errors.push('Password must be at least 8 characters long and include one uppercase, one lowercase, one digit, and one special character.');
    }
  
    if (controls['csvFile']?.hasError('invalid')) {
      errors.push('Uploaded file is not valid.');
    }
  
    return errors;
  }
  

  getErrorMessage(instance: string): string {
    let message = '';
    const control = this.myFormControls[instance];
    if (!control || !control.errors) return '';

    switch (instance) {
      case 'email':
        if (control.hasError('required')) {
          message = 'Please enter your email';
        }
        if (control.hasError('email')) {
          message = 'Sorry, this is not a valid email';
        }
        break;

      case 'password':
        if (control.hasError('required') || control.hasError('pattern') || control.hasError('minlength') || control.hasError('maxlength')) {
          message = 'Your password must be 8 characters long with at least one character and one special character';
        }        
        break;

      case 'firstName':
        if (control.hasError('containsNumber')) {
          message = 'First name should not contain numbers';
        }
        break;

      case 'lastName':
        if (control.hasError('containsNumber')) {
          message = 'Last name should not contain numbers';
        }
        break;

      case 'csvFile':
        if (control.hasError('invalid')) {
          message = 'The uploaded CSV file is invalid. Please download the sample file and try again.';
        }
        break;

      default:
        return message;
    }
    return message;
  }

  onSubmit() {
    this.errors = [];

    if (this.myForm.valid) {

      const formData: FormDataInterfaceForLocalStorage = {
        email: this.myForm.value.email,
        firstName: this.myForm.value.firstName,
        lastName: this.myForm.value.lastName,
        subscription: this.myForm.value.subscription,
      }

      this.formDataService.setFormData(formData);

      this.formDataService.setCSVData(this.csvData);

      this.router.navigate(['/result'], {});
    } else {
      this.errors = this.collectFormErrors();
      this.myForm.markAllAsTouched();
    }
  };

  public csvData: CsvInterface = { headers: [], rows: [] };

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file || file.type !== 'text/csv') {
      this.myForm.get('csvFile')?.setErrors({ invalid: true });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const parsed = this.processCSV(text);

      if (!this.validateCSVHeaders(parsed.headers)) {
        this.csvData = { headers: [], rows: [] };
        this.myForm.get('csvFile')?.setErrors({ invalid: true });
      } else {
        this.myForm.get('csvFile')?.setErrors(null);
        this.csvData = parsed;
        this.myForm.patchValue({ file });
      }

    };

    reader.readAsText(file);
  }

  processCSV(csvText: string): { headers: string[]; rows: string[][] } {
    const lines = csvText.trim().split('\n').filter(Boolean);

    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map(cell => cell.trim());

    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(cell => cell.trim());
      while (values.length < headers.length) values.push('');
      return values;
    });

    return { headers, rows };
  }

  validateCSVHeaders(uploadedHeaders: string[]): boolean {
    const expected = this.csvHeaders.map(h => h.toLowerCase()).sort();
    const actual = uploadedHeaders.map(h => h.toLowerCase()).sort();
    return JSON.stringify(expected) === JSON.stringify(actual);
  }


  public togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ClearDialogComponent, {
      width: '250px',
      data: {
        title: 'Clear Form',
        message: 'Are you sure you want to clear the form?'
      },
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myForm.reset({ subscription: SubscriptionPlans.ADVANCED });
        this.errors = [];
      }
    });
  }

}
