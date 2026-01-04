import {Component, signal, inject} from '@angular/core';
import {ColumnDefinition, defaultPagination, GenericGrid, Pagination} from '../components/generic-grid.';
import {Localization, LocalizationService} from '../service/localization.service';

@Component({
  standalone: true,
  selector: 'page-localization',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      title="Lokaliacje"
      subtitle="Lista wszystkich lokalizacji, w których oferujesz swoje produkty"
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
      [deletable]="service"
      (onDelete)="onDelete()"
    />
  `,
  styles: ``,
})
export class LocalizationPage {
  readonly service = inject(LocalizationService);

  columns: ColumnDefinition[] = [
    {key: 'name', label: 'Nazwa', type: 'text'},
  ];

  pagination = signal<Pagination<Localization>>(defaultPagination);

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
