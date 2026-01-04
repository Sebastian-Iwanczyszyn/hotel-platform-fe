import {Pipe, PipeTransform} from '@angular/core';
import {OrderState} from '../model/payment-service';

@Pipe({
  name: 'orderState',
  standalone: true
})
export class OrderStatePipe implements PipeTransform {
  private stateLabels: Record<OrderState, string> = {
    [OrderState.CREATED]: 'Utworzone',
    [OrderState.PAYMENT_METHOD_UPDATED]: 'Zaktualizowano metodę płatności',
    [OrderState.PROCESSING]: 'Przetwarzanie',
    [OrderState.COMPLETED]: 'Zakończone',
    [OrderState.FAILED]: 'Niepowodzenie',
    [OrderState.CANCELED]: 'Anulowane',
  };

  transform(value: OrderState): string {
    return this.stateLabels[value] || value;
  }
}
