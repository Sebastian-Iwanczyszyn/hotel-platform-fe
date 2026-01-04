import {Component, inject, signal} from '@angular/core';
import {ColumnDefinition, defaultPagination, GenericGrid, Pagination} from '../components/generic-grid.';
import {ProductType} from '../service/product-type.service';
import {ProductService} from '../service/product.service';

@Component({
  standalone: true,
  selector: 'page-product',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      title="Produkty"
      subtitle="Lista wszystkich produktów, któe oferujesz (apartamenty, pokoje, domki, itp.)"
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

  pagination = signal<Pagination<ProductType>>(defaultPagination);

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


