import {Component, OnInit} from '@angular/core';
import {ColumnDefinition, GenericGrid, PaginationParams} from '../components/generic-grid.';
import {LocalizationService} from '../service/localization.service';

@Component({
  standalone: true,
  selector: 'page-product-type',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [data]="data"
      [paginationParams]="pagination"
    />
  `,
  styles: ``,
})
export class ProductTypePage implements OnInit {
  columns: ColumnDefinition[] = [
    { key: 'name', label: 'Nazwa', type: 'text' },
  ];

  data = [
    { id: 1, name: 'Example 1' },
    { id: 2, name: 'Example 2' },
  ];

  pagination: PaginationParams = {
    pageIndex: 0,
    pageSize: 10,
    length: this.data.length
  };

  constructor(private readonly service: LocalizationService) {
  }

  ngOnInit(): void {
  }
}
