import {Component, inject, signal} from '@angular/core';
import {ColumnDefinition, GenericGrid, Pagination} from '../components/generic-grid.';
import {ProductType, ProductTypeService} from '../service/product-type.service';

@Component({
  standalone: true,
  selector: 'page-product-type',
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
export class ProductTypePage {
  readonly service = inject(ProductTypeService);

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
