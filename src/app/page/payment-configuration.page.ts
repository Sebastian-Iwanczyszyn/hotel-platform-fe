import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {BankTransferForm} from '../components/form/bank-transfer.form';
import {PayUForm} from '../components/form/payu.form';

@Component({
  standalone: true,
  selector: 'page-payment',
  imports: [MatTabsModule, BankTransferForm, PayUForm],
  template: `
    <mat-tab-group [(selectedIndex)]="activeTab" (selectedTabChange)="onTabChange($event.index)">
      <mat-tab label="Przelew bankowy">
        <div class="tab-content">
            <bank-transfer-form></bank-transfer-form>
        </div>
      </mat-tab>

      <mat-tab label="PayU">
        <div class="tab-content">
            <payu-form></payu-form>
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

  onTabChange(index: number) {
    console.log('Selected tab:', index);
    // Tutaj możesz załadować dane dla konkretnej metody płatności
    this.loadDataForPaymentMethod(index);
  }

  private loadDataForPaymentMethod(index: number) {
    // Implementacja ładowania danych dla wybranej zakładki
    const methods = ['bank-transfer', 'payu', 'tpay', 'paypal'];
    console.log(`Loading data for: ${methods[index]}`);
  }
}
