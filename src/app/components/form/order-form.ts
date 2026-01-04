import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'order-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
  ],
  template: `
    <form-component
      [title]="'Zamówienie'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input readonly matInput formControlName="name" placeholder="Enter name"/>
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
export class OrderForm {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<OrderForm>);
  data = inject(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  constructor() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
