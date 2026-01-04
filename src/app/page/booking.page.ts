import {Component, signal, inject} from '@angular/core';
import {ColumnDefinition, GenericGrid, Pagination} from '../components/generic-grid.';
import {Booking, BookingService} from '../service/booking.service';

@Component({
  standalone: true,
  selector: 'page-booking',
  imports: [GenericGrid],
  template: `
    <app-generic-grid
      [visibleColumns]="columns"
      [paginationParams]="pagination()"
      [isEditable]="false"
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

  pagination = signal<Pagination<Booking>>({
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
