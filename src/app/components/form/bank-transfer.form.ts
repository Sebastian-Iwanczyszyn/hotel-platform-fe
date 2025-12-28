import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {
  BankTransferConfiguration,
  CreatePaymentProviderDto,
  PaymentProviderType,
  PaymentService
} from '../../service/payment.service';

@Component({
  standalone: true,
  selector: 'bank-transfer-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
  ],
  template: `
    <form-component
      [title]="'Przelew bankowy'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>IBAN</mat-label>
          <input matInput formControlName="iban" placeholder="PL61 1090 1014 0000 0712 1981 2874"/>
          @if (form.get('iban')?.hasError('required') && form.get('iban')?.touched) {
            <mat-error>IBAN jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Właściciel konta</mat-label>
          <input matInput formControlName="accountHolderName" placeholder="Jan Kowalski"/>
          @if (form.get('accountHolderName')?.hasError('required') && form.get('accountHolderName')?.touched) {
            <mat-error>Właściciel konta jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Adres</mat-label>
          <textarea matInput formControlName="address" placeholder="ul. Przykładowa 123, 00-001 Warszawa"
                    rows="3"></textarea>
          @if (form.get('address')?.hasError('required') && form.get('address')?.touched) {
            <mat-error>Adres jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nazwa banku (opcjonalne)</mat-label>
          <input matInput formControlName="bankName" placeholder="PKO Bank Polski"/>
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
export class BankTransferForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(PaymentService);
  private id: string | undefined;

  readonly form = this.fb.group({
    iban: ['', Validators.required],
    accountHolderName: ['', Validators.required],
    address: ['', Validators.required],
    bankName: ['', Validators.required],
  });

  constructor() {
    this.service.getByType<BankTransferConfiguration>(PaymentProviderType.BANK_TRANSFER).subscribe(response => {
      const data = response.configuration;
      this.id = response.id;
      this.form.patchValue({
        iban: data.iban,
        accountHolderName: data.accountHolderName,
        address: data.address,
        bankName: data.bankName,
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data: CreatePaymentProviderDto = {
      configuration: this.form.value,
      type: PaymentProviderType.BANK_TRANSFER,
      active: false,
    } as CreatePaymentProviderDto;

    if (this.id) {
      this.service.update<BankTransferConfiguration>(this.id, data).subscribe(result => {
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
