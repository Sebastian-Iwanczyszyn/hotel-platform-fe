import {Component, inject} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {BankTransferForm} from '../components/form/bank-transfer.form';
import {PayUForm} from '../components/form/payu.form';
import {
  BankTransferConfiguration,
  CreatePaymentProviderDto,
  PaymentService,
} from '../service/payment.service';
import {PaymentConfigurationSubmitted} from '../model/payment';

@Component({
  standalone: true,
  selector: 'page-payment',
  imports: [MatTabsModule, BankTransferForm, PayUForm],
  template: `
    <mat-tab-group [(selectedIndex)]="activeTab" (selectedTabChange)="onTabChange($event.index)">
      <mat-tab label="Przelew bankowy">
        <div class="tab-content">
            <bank-transfer-form (submit)="submit($event)"></bank-transfer-form>
        </div>
      </mat-tab>

      <mat-tab label="PayU">
        <div class="tab-content">
            <payu-form (submit)="submit($event)"></payu-form>
        </div>
      </mat-tab>

      <mat-tab label="TPay (wkrótce)" disabled>
        <div class="tab-content">

        </div>
      </mat-tab>

      <mat-tab label="PayPal (wkrótce)" disabled>
        <div class="tab-content">

        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: `
    .tab-content {
      padding: 24px 0;
    }
  `,
})
export class PaymentConfigurationPage {
  activeTab = 0;
  private service = inject(PaymentService);

  onTabChange(index: number) {
    this.loadDataForPaymentMethod(index);
  }

  submit(event: PaymentConfigurationSubmitted) {
    const data: CreatePaymentProviderDto = {
      configuration: event.configuration,
      type: event.type,
      active: event.active,
    } as CreatePaymentProviderDto;

    if (event.id) {
      this.service.update<BankTransferConfiguration>(event.id, data).subscribe(result => {
      });
      return;
    }

    this.service.create(data).subscribe(result => {
    });
  }

  private loadDataForPaymentMethod(index: number) {
    const methods = ['bank-transfer', 'payu', 'tpay', 'paypal'];
  }
}
