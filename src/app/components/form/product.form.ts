import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormComponent} from './form-component';
import {UploadFile} from '../upload-file';

enum Visibility {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

@Component({
  standalone: true,
  selector: 'product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormComponent,
    UploadFile,
  ],
  template: `
    <form-component
      [title]="'Produkt'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter product name"/>
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Original Price</mat-label>
          <input matInput type="number" formControlName="originalPrice" placeholder="0.00"/>
          @if (form.get('originalPrice')?.hasError('required') && form.get('originalPrice')?.touched) {
            <mat-error>Original price is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Sale Price</mat-label>
          <input matInput type="number" formControlName="salePrice" placeholder="0.00"/>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Localization</mat-label>
          <mat-select formControlName="localizationId">
            <mat-option value="">Select localization</mat-option>
            @for (loc of localizations; track loc.id) {
              <mat-option [value]="loc.id">{{ loc.name }}</mat-option>
            }
          </mat-select>
          @if (form.get('localizationId')?.hasError('required') && form.get('localizationId')?.touched) {
            <mat-error>Localization is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Type</mat-label>
          <mat-select formControlName="productTypeId">
            <mat-option value="">Select product type</mat-option>
            @for (type of productTypes; track type.id) {
              <mat-option [value]="type.id">{{ type.name }}</mat-option>
            }
          </mat-select>
          @if (form.get('productTypeId')?.hasError('required') && form.get('productTypeId')?.touched) {
            <mat-error>Product type is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" min="1"/>
          @if (form.get('quantity')?.hasError('required') && form.get('quantity')?.touched) {
            <mat-error>Quantity is required</mat-error>
          }
          @if (form.get('quantity')?.hasError('min')) {
            <mat-error>Quantity must be at least 1</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Visibility</mat-label>
          <mat-select formControlName="visibility">
            @for (vis of visibilityOptions; track vis.value) {
              <mat-option [value]="vis.value">{{ vis.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image ID</mat-label>
          <input matInput formControlName="imageId" placeholder="Optional image ID"/>
        </mat-form-field>

        <div class="py-5">
          <upload-file></upload-file>
        </div>
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
export class ProductForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    originalPrice: ['', Validators.required],
    salePrice: [null],
    localizationId: [null, Validators.required],
    productTypeId: [null, Validators.required],
    imageId: [null],
    quantity: [1, [Validators.required, Validators.min(1)]],
    visibility: [Visibility.PUBLISHED, Validators.required],
  });

  visibilityOptions = [
    {value: Visibility.PUBLISHED, label: 'Published'},
    {value: Visibility.DRAFT, label: 'Draft'},
    {value: Visibility.ARCHIVED, label: 'Archived'}
  ];

  localizations = [
    {id: '1', name: 'Location 1'},
    {id: '2', name: 'Location 2'}
  ];

  productTypes = [
    {id: '1', name: 'Type 1'},
    {id: '2', name: 'Type 2'}
  ];

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = {
      ...this.form.value,
      originalPrice: parseFloat(this.form.value.originalPrice!),
      salePrice: this.form.value.salePrice ? parseFloat(this.form.value.salePrice) : null,
      quantity: this.form.value.quantity,
    };
    console.log('Form submitted:', formData);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
