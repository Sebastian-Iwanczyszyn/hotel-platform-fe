import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../module/material.module';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvailabilityDto, PublicService} from '../service/public.service';
import {debounce, delay} from 'rxjs';

interface Product {
  id: string;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-booking-search',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="booking-wrapper">
        <div class="row g-0 align-items-stretch">
          <!-- Arrival -->
          <div class="col-12 col-md-5 field">
            <div class="label">DATA PRZYJAZDU</div>

            <mat-form-field class="w-100 flat-field">
              <input
                matInput
                [matDatepicker]="startFromPicker"
                formControlName="startFrom"
                placeholder="Wybierz datę"
                required
                [min]="minDate"
                [matDatepickerFilter]="dateFilter"
              />
              <mat-datepicker-toggle matSuffix [for]="startFromPicker"></mat-datepicker-toggle>
              <mat-datepicker #startFromPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <!-- Departure -->
          <div class="col-12 col-md-5 field divider">
            <div class="label">DATA WYJAZDU</div>

            <mat-form-field class="w-100 flat-field">
              <input
                matInput
                [matDatepicker]="toPicker"
                formControlName="endedAt"
                placeholder="Wybierz datę"
                required
                [min]="form.value.startFrom || minDate"
              />
              <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <!-- CTA -->
          <div class="col-12 col-md-2 cta">
            <button
              mat-flat-button
              color="primary"
              class="cta-button"
              type="submit"
              [disabled]="form.invalid"
            >
              <mat-icon class="me-2">search</mat-icon>
              Szukaj
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: `
    .booking-wrapper{
      width: 100%;
      border-radius: 14px;
      background: rgba(255,255,255,.96);
      border: 1px solid rgba(17,17,17,.10);
      padding: 10px;
    }

    .field{
      padding: 10px 14px;
      display:flex;
      flex-direction: column;
      justify-content: center;
      min-height: 74px;
    }

    .label{
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(17,17,17,.55);
      margin-bottom: 6px;
    }

    @media (min-width: 768px){
      .divider{
        border-left: 1px solid rgba(17,17,17,.10);
      }
    }

    .cta{
      padding: 10px;
      display:flex;
      align-items:center;
      justify-content: center;
    }

    .cta-button{
      width: 100%;
      height: 46px;
      border-radius: 12px;
      font-weight: 800;
      text-transform: none;
    }

    .cta-button mat-icon{
      width: 20px;
      height: 20px;
      font-size: 22px;
    }

    /* Mobile: pola jako stack + linie poziome */
    @media (max-width: 767px){
      .booking-wrapper{
        padding: 8px;
      }
      .field{
        min-height: 68px;
        padding: 10px 12px;
      }
      .divider{
        border-left: 0;
        border-top: 1px solid rgba(17,17,17,.10);
      }
      .cta{
        border-top: 1px solid rgba(17,17,17,.10);
      }
    }
  `,

})
export class BookingSearch {
  form: FormGroup;
  minDate = this.startOfDay(new Date());
  publicLocalizationId = input<string>();

  availabilityFound = output<AvailabilityDto[]>();
  isSearching = output<boolean>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly publicService: PublicService,
  ) {
    this.form = this.fb.group({
      startFrom: [null, Validators.required],
      endedAt: [null, Validators.required],
    });
  }

  submit(): void {
    const id = this.publicLocalizationId();
    if (!id) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSearching.emit(true);

    this.publicService.checkAvailabilityForLocalization(id, this.form.value).pipe(delay(1500)).subscribe(response => {
      this.isSearching.emit(false);
      this.availabilityFound.emit(response);
    });
  }

  dateFilter = (d: Date | null) => {
    if (!d) return false;
    return this.startOfDay(d) >= this.minDate;
  };

  private startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
}
