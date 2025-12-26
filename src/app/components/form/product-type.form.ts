import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';

@Component({
  standalone: true,
  selector: 'product-type-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
  ],
  template: `
    <form-component
      [title]="'Typ produktu'"
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
export class ProductTypeForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    console.log('Form submitted:', this.form.value);
  }

  onCancel(): void {
    this.router.navigate(['/product-types']);
  }
}
