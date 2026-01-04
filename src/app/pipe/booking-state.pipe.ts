import { Pipe, PipeTransform } from '@angular/core';
import {BookingState} from '../service/booking.service';

@Pipe({
  name: 'bookingState',
  standalone: true
})
export class BookingStatePipe implements PipeTransform {
  transform(value: BookingState): string {
    const stateMap: Record<BookingState, string> = {
      [BookingState.RESERVED]: 'Zarezerwowane',
      [BookingState.BOOKED]: 'Zarezerwowane',
      [BookingState.SUCCESS]: 'Zakończone',
      [BookingState.CANCELLED]: 'Anulowane'
    };
    return stateMap[value] || value;
  }
}
