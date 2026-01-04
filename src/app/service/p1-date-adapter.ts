import {Inject, Injectable, Optional} from '@angular/core';
import {MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';

@Injectable()
export class PlDateAdapter extends NativeDateAdapter {
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string) {
    super(matDateLocale);
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}
