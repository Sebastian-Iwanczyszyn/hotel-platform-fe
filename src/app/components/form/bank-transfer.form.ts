import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {BankTransferConfiguration, PaymentProvider, PaymentProviderType} from '../../service/payment.service';
import {PaymentForm} from './payment.form';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  selector: 'bank-transfer-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
    MatSlideToggle,
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

        <mat-slide-toggle formControlName="active" color="primary">
          Aktywna
        </mat-slide-toggle>
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
export class BankTransferForm extends PaymentForm<BankTransferConfiguration> {
  private fb = inject(FormBuilder);

  constructor() {
    super(PaymentProviderType.BANK_TRANSFER);
  }

  protected creteForm(): FormGroup {
    return this.fb.group({
      iban: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      address: ['', Validators.required],
      bankName: ['', Validators.required],
      active: [false, Validators.required],
    });
  }

  protected patchForm(response: PaymentProvider<BankTransferConfiguration>): void {
    const data = response.configuration;
    this.form.patchValue({
      iban: data.iban,
      accountHolderName: data.accountHolderName,
      address: data.address,
      bankName: data.bankName,
      active: response.active,
    });
  }
}
