import {Component, OnInit} from '@angular/core';
import {ColumnDefinition, GenericGrid, PaginationParams} from '../components/generic-grid.';
import {Localization, LocalizationService} from '../service/localization.service';

@Component({
  standalone: true,
  selector: 'page-localization',
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
export class LocalizationPage implements OnInit {
  columns: ColumnDefinition[] = [
    { key: 'name', label: 'Nazwa', type: 'text' },
  ];

  data: Localization[] = [];

  pagination: PaginationParams = {
    pageIndex: 0,
    pageSize: 10,
    length: this.data.length
  };

  constructor(private readonly service: LocalizationService) {
  }

  ngOnInit(): void {
    this.service.list().subscribe(response => {
      this.data = response.data;
      this.pagination.length = response.total;
    })
  }
}
