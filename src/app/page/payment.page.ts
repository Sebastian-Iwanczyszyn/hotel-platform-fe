import {Component, inject, signal} from '@angular/core';
import {ColumnDefinition, defaultPagination, GenericGrid, Pagination} from '../components/generic-grid.';
import {PaymentService} from '../service/payment.service';
import {Order} from '../model/payment-service';
import {OrderForm} from '../components/form/order-form';

@Component({
  standalone: true,
  selector: 'page-payment',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      title="Zamówienia"
      subtitle="Lista wszystkich zamówień powiązanych z Twoimi rezerwacjami (podgląd)"
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
      [createButton]="false"
      [isEditable]="false"
      [preview]="OrderForm"
    />
  `,
  styles: ``,
})
export class PaymentPage {
  readonly service = inject(PaymentService);

  columns: ColumnDefinition[] = [
    {key: 'id', label: 'ID Zamówienia', type: 'text'},
    {key: 'bookingPublicId', label: 'Publiczny identyfikator bookingu', type: 'text'},
    {key: 'totalAmount', label: 'Cena całkowita', type: 'price'},
    {key: 'state', label: 'Status', type: 'order-state'},
    {key: 'createdAt', label: 'Data stworzenia', type: 'text'},
  ];

  pagination = signal<Pagination<Order>>(defaultPagination);

  constructor() {
    this.service.list().subscribe(response => {
      console.log(response);
      this.pagination.set(response);
    });
  }

  protected readonly OrderForm = OrderForm;
}

