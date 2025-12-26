import {Component, signal, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ColumnDefinition, GenericGrid, PaginationParams} from '../components/generic-grid.';
import {Localization, LocalizationService} from '../service/localization.service';

@Component({
  standalone: true,
  selector: 'page-localization',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
    />
  `,
  styles: ``,
})
export class LocalizationPage {
  private readonly service = inject(LocalizationService);

  columns: ColumnDefinition[] = [
    {key: 'name', label: 'Nazwa', type: 'text'},
  ];

  pagination = signal<PaginationParams<Localization>>({
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
}
