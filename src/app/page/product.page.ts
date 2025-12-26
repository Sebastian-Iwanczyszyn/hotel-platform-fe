import {Component, inject, signal} from '@angular/core';
import {ColumnDefinition, GenericGrid, Pagination} from '../components/generic-grid.';
import {ProductType} from '../service/product-type.service';
import {ProductService} from '../service/product.service';

@Component({
  standalone: true,
  selector: 'page-product',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
      [deletable]="service"
      (onDelete)="onDelete()"
    />
  `,
  styles: ``,
})
export class ProductPage {
  readonly service = inject(ProductService);

  columns: ColumnDefinition[] = [
    {key: 'name', label: 'Nazwa', type: 'text'},
  ];

  pagination = signal<Pagination<ProductType>>({
    data: [],
    page: 0,
    totalItems: 10,
    totalPages: 0,
  });

  constructor() {
    this.service.list().subscribe(response => {
      this.pagination.set(response);
    });
  }

  onDelete() {
    this.service.list().subscribe(response => {
      this.pagination.set(response);
    });
  }
}


