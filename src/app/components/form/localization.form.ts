import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {CreateLocalizationDto, LocalizationService} from '../../service/localization.service';

@Component({
  standalone: true,
  selector: 'localization-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
  ],
  template: `
    <form-component
      [title]="'Lokalizacja'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter name"/>
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Check In</mat-label>
          <input matInput type="time" formControlName="checkIn"/>
          @if (form.get('checkIn')?.hasError('required') && form.get('checkIn')?.touched) {
            <mat-error>Check in time is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Check Out</mat-label>
          <input matInput type="time" formControlName="checkOut"/>
          @if (form.get('checkOut')?.hasError('required') && form.get('checkOut')?.touched) {
            <mat-error>Check out time is required</mat-error>
          }
        </mat-form-field>
      </form>
    </form-component>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      width: 100%;
    }
  `,
})
export class LocalizationForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(LocalizationService);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    checkIn: ['14:00', Validators.required],
    checkOut: ['11:00', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.service.create(this.form.value as CreateLocalizationDto).subscribe(result => {
      this.router.navigate(['/admin/localizations']);
    })
  }

  onCancel(): void {
    this.router.navigate(['/admin/localizations']);
  }
}
