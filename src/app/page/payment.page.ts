import {Component} from '@angular/core';
import {ColumnDefinition, GenericGrid, Pagination} from '../components/generic-grid.';

@Component({
  standalone: true,
  selector: 'page-payment',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [paginationParams]="pagination"
    />
  `,
  styles: ``,
})
export class PaymentPage {
  columns: ColumnDefinition[] = [
    { key: 'name', label: 'Nazwa', type: 'text' },
  ];

  pagination: Pagination<any> = {
    data: [],
    page: 0,
    totalItems: 10,
    totalPages: 0,
  };
}

