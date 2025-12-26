import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {CreateDto, ProductTypeService} from '../../service/product-type.service';

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
  private activatedRoute = inject(ActivatedRoute);
  private service = inject(ProductTypeService);

  readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.service.getById(id).subscribe(data => {
          this.form.patchValue({
            name: data.name,
          });
        });
      }
    })
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.service.create(this.form.value as CreateDto).subscribe(res => {
      this.router.navigate(['/admin/facility/product-types']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/facility/product-types']);
  }
}
