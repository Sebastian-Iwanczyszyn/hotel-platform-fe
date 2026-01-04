import {Component, signal, inject} from '@angular/core';
import {ColumnDefinition, defaultPagination, GenericGrid, Pagination} from '../components/generic-grid.';
import {Booking, BookingService} from '../service/booking.service';

@Component({
  standalone: true,
  selector: 'page-booking',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      title="Rezerwacje"
      subtitle="Lista wszystkich rezerwacji dokonanych przez Twoich gości"
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
      [isEditable]="false"
      (pageChange)="pageChange($event)"
    />
  `,
  styles: ``,
})
export class BookingPage {
  readonly service = inject(BookingService);

  columns: ColumnDefinition[] = [
    {key: 'id', label: 'ID', type: 'text'},
    {key: 'publicId', label: 'Publiczny Identyfikator', type: 'text'},
    {key: 'startFrom', label: 'Data przyjazdu', type: 'date'},
    {key: 'endedAt', label: 'Data wyjazdu', type: 'date'},
    {key: 'paymentState', label: 'Status', type: 'booking-state'},
    {key: 'personName', label: 'Imię i nazwisko gościa', type: 'text'},
    {key: 'nip', label: 'Czy firma', type: 'boolean'},
    {key: 'nights', label: 'Ilość noclegów', type: 'text'},
  ];

  pagination = signal<Pagination<Booking>>(defaultPagination);

  constructor() {
    this.loadData();
  }

  pageChange(event: any) {
    this.loadData(event.page, event.limit);
  }

  loadData(page: number = 1, limit: number = 25) {
    this.service.list(page, limit).subscribe(response => {
      this.pagination.set(response);
    });
  }
}
