import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from './form-component';
import {UploadFile} from '../upload-file';
import {Localization, LocalizationService} from '../../service/localization.service';
import {ProductType, ProductTypeService} from '../../service/product-type.service';
import {CreateDto, ProductService, UpdateDto, Visibility} from '../../service/product.service';
import {ViewUploaded} from '../../model/upload';
import {MaterialModule} from '../../module/material.module';

@Component({
  standalone: true,
  selector: 'product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    UploadFile,
    MaterialModule,
  ],
  template: `
    <form-component
      [title]="'Produkt'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <div class="row p-3">
        <div class="col-6">
          <div class="row">
            <mat-card class="form-card p-2">
              <mat-card-content>
                <form [formGroup]="form" class="form">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Name</mat-label>
                    <input matInput formControlName="name" placeholder="Enter product name"/>
                    @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                      <mat-error>Name is required</mat-error>
                    }
                  </mat-form-field>

                  <div class="row">
                    <div class="col">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Original Price</mat-label>
                        <input matInput type="text" formControlName="originalPrice" placeholder="0.00"/>
                        @if (form.get('originalPrice')?.hasError('required') && form.get('originalPrice')?.touched) {
                          <mat-error>Original price is required</mat-error>
                        }
                      </mat-form-field>

                    </div>
                    <div class="col">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Sale Price</mat-label>
                        <input matInput type="number" formControlName="salePrice" placeholder="0.00"/>
                      </mat-form-field>
                    </div>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Localization</mat-label>
                    <mat-select formControlName="localizationId">
                      <mat-option value="">Select localization</mat-option>
                      @for (loc of localizations(); track loc.id) {
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
                      @for (type of productTypes(); track type.id) {
                        <mat-option [value]="type.id">{{ type.name }}</mat-option>
                      }
                    </mat-select>
                    @if (form.get('productTypeId')?.hasError('required') && form.get('productTypeId')?.touched) {
                      <mat-error>Product type is required</mat-error>
                    }
                  </mat-form-field>

                  <div class="row">
                    <div class="col">

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
                    </div>
                    <div class="col">

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Visibility</mat-label>
                        <mat-select formControlName="visibility">
                          @for (vis of visibilityOptions; track vis.value) {
                            <mat-option [value]="vis.value">{{ vis.label }}</mat-option>
                          }
                        </mat-select>
                      </mat-form-field>

                    </div>
                  </div>

                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
        <div class="col-6">
          <upload-file [viewUploaded]="viewUploaded" (uploaded)="onUpload($event)"></upload-file>
        </div>
      </div>
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
  private localizationService = inject(LocalizationService);
  private productTypesService = inject(ProductTypeService);
  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private id: string|undefined = undefined;
  viewUploaded: ViewUploaded|null = null;

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    originalPrice: [0, Validators.required],
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

  localizations = signal<Localization[]>([]);
  productTypes = signal<ProductType[]>([]);

  constructor() {
    this.localizationService.list().subscribe(result => {
      this.localizations.set(result.data);
    });

    this.productTypesService.list().subscribe(result => {
      this.productTypes.set(result.data);
    });

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.id = id;
        this.productService.getById(id).subscribe(data => {
          this.form.patchValue({
            name: data.name,
            originalPrice: data.originalPrice,
            salePrice: data.salePrice,
            localizationId: data.localization.id,
            productTypeId: data.type,
            imageId: data.viewUploaded?.id,
            quantity: data.quantity,
            visibility: data.visibility,
          });
          this.viewUploaded = data.viewUploaded;
        });
      }
    })
  }

  onUpload(event: string|null) {
    this.form.patchValue({ imageId: event });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const formData: CreateDto|UpdateDto = {
      name: formValue.name,
      originalPrice: formValue.originalPrice,
      salePrice: formValue.salePrice,
      localizationId: formValue.localizationId,
      productTypeId: formValue.productTypeId,
      imageId: formValue.imageId || null,
      quantity: formValue.quantity,
      visibility: formValue.visibility,
    };

    if (this.id) {
      this.productService.update(this.id, formData as UpdateDto).subscribe(() => {
        this.router.navigate(['/admin/facility/products']);
      });
      return;
    }

    this.productService.create(formData as CreateDto).subscribe(() => {
      this.router.navigate(['/admin/facility/products']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/facility/products']);
  }
}
