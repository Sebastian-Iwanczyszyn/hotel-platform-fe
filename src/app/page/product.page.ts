import {Component, OnInit} from '@angular/core';
import {ColumnDefinition, GenericGrid, PaginationParams} from '../components/generic-grid.';

@Component({
  standalone: true,
  selector: 'page-product',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [paginationParams]="pagination"
    />
  `,
  styles: ``,
})
export class ProductPage {
  columns: ColumnDefinition[] = [
    { key: 'name', label: 'Nazwa', type: 'text' },
  ];

  pagination: PaginationParams<any> = {
    data: [],
    page: 0,
    totalItems: 10,
    totalPages: 0,
  };
}


