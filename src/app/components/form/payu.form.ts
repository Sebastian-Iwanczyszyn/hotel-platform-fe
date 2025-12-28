import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {
  CreatePaymentProviderDto,
  PaymentProviderType,
  PaymentService,
  PayUConfiguration
} from '../../service/payment.service';

@Component({
  standalone: true,
  selector: 'payu-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
  ],
  template: `
    <form-component
      [title]="'Konfiguracja PayU'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Merchant POS ID</mat-label>
          <input matInput formControlName="merchant_pos_id" placeholder="123456"/>
          @if (form.get('merchant_pos_id')?.hasError('required') && form.get('merchant_pos_id')?.touched) {
            <mat-error>Merchant POS ID jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Client ID</mat-label>
          <input matInput formControlName="client_id" placeholder="123456"/>
          @if (form.get('client_id')?.hasError('required') && form.get('client_id')?.touched) {
            <mat-error>Client ID jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Client Secret</mat-label>
          <input matInput type="text" formControlName="client_secret" placeholder="client secret"/>
          @if (form.get('client_secret')?.hasError('required') && form.get('client_secret')?.touched) {
            <mat-error>Client Secret jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Second Key</mat-label>
          <input matInput type="text" formControlName="second_key" placeholder="second key"/>
          @if (form.get('second_key')?.hasError('required') && form.get('second_key')?.touched) {
            <mat-error>Second Key jest wymagany</mat-error>
          }
        </mat-form-field>
      </form>
    </form-component>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }
  `,
})
export class PayUForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(PaymentService);
  private id: string|undefined;

  readonly form = this.fb.group({
    merchant_pos_id: ['', Validators.required],
    client_id: ['', Validators.required],
    client_secret: ['', Validators.required],
    second_key: ['', Validators.required],
  });

  constructor() {
    this.service.getByType<PayUConfiguration>(PaymentProviderType.PAYU).subscribe(response => {
      const data = response.configuration;
      this.id = response.id;
      this.form.patchValue({
        merchant_pos_id: data.merchant_pos_id,
        client_id: data.client_id,
        client_secret: data.client_secret,
        second_key: data.second_key,
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data: CreatePaymentProviderDto = {
      configuration: this.form.value,
      type: PaymentProviderType.PAYU,
      active: false,
    } as CreatePaymentProviderDto;

    if (this.id) {
      this.service.update<PayUConfiguration>(this.id, data).subscribe(result => {
        console.log(result);
      });
      return;
    }

    this.service.create(data).subscribe(result => {
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/payments']);
  }
}
