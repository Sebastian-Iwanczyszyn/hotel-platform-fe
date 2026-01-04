import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../module/material.module';
import { AvailabilityDto } from '../service/public.service';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-booking-tile',
  imports: [CommonModule, MaterialModule, DatePipe, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row mb-3">
        <div class="col-12">
          <h1 class="page-title">Dostępne opcje na Twój termin</h1>
          <p class="results-count mt-4">{{ availability().length }} dostępnych obiektów</p>
        </div>
      </div>

      <div class="row">
        @for (av of availability(); track $index) {
          <div class="col-12">
            <mat-card class="stay-card">
              <div class="shell">
                <div class="row">
                  <div class="col-12 col-lg-4">
                    <div class="media">
                      <div
                        class="media-bg"
                        [style.background-image]="'url(' + av.product.url + ')'"
                        role="img"
                        [attr.aria-label]="av.product.name"
                      >
                      </div>
                    </div>
                  </div>

                  <!-- CONTENT -->
                  <div class="col-12 col-lg-8">
                    <mat-card-content class="body">
                      <span class="type-pill">TEST</span>

                      <h2 class="title">{{ av.product.name }}</h2>

                      <p class="desc">
                        Przestronny apartament w samym sercu miasta. Idealny dla par szukających luksusu i wygody.
                        Blisko stacji metra i głównych atrakcji.
                      </p>

                      <div class="amenities">
                        <div class="amenity">
                          <mat-icon>square_foot</mat-icon><span>55m²</span>
                        </div>
                        <div class="amenity">
                          <mat-icon>bed</mat-icon><span>KingBed</span>
                        </div>
                        <div class="amenity">
                          <mat-icon>balcony</mat-icon><span>Balkon</span>
                        </div>
                        <div class="amenity">
                          <mat-icon>wifi</mat-icon><span>WiFi</span>
                        </div>
                      </div>

                      <mat-divider class="divider"></mat-divider>

                      <div class="bottom">
                        <div class="price">
                          <div class="price-label">ŁĄCZNA CENA ZA POBYT</div>

                          <div class="price-row">
                            <span class="price-current">{{ av.total }} zł</span>
                          </div>
                        </div>

                        <a
                          [routerLink]="['/app', 'view', av.product.id]"
                          [queryParams]="{startFrom: av.pricePerDay[0].date, endTo: av.pricePerDay.at(-1)!.date, endedAt: av.pricePerDay.at(-1)!.date}"
                          mat-flat-button
                          color="primary">
                          <mat-icon class="cta-icon">arrow_forward</mat-icon>
                          Zobacz szczegóły
                        </a>
                      </div>

                        <div class="dates">
                          <mat-chip-set>
                            <mat-chip>
                              Długość pobytu {{ av.pricePerDay.length }}
                              <span>
                              </span>
                            </mat-chip>
                            <mat-chip>
                              {{ av.pricePerDay[0].date | date:'d MMM' }} -
                              {{ av.pricePerDay.at(-1)!.date | date:'d MMM y' }}
                            </mat-chip>
                          </mat-chip-set>
                        </div>
                    </mat-card-content>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .page-title{
      font-size: 40px;
      font-weight: 800;
      letter-spacing: -0.6px;
      margin: 0 0 8px 0;
      color: #111;
    }
    .page-subtitle{
      display:flex;
      gap: 10px;
      align-items:center;
      color: rgba(17,17,17,.65);
      font-size: 14px;
      margin-bottom: 10px;
    }
    .dot{ opacity: .6; }
    .results-count{
      margin: 0;
      color: rgba(17,17,17,.60);
      font-size: 14px;
    }

    /* Mat card – bez overflow hidden, żeby NIC nie było ucinane */
    .stay-card{
      border-radius: 16px;
      background: transparent;
      box-shadow: 0 12px 26px rgba(0,0,0,.08);
      overflow: visible; /* <-- FIX na "ucięte od dołu" */
      border: 0;
    }

    /* Shell – tu trzymamy rogi i przycinanie obrazka */
    .shell{
      border-radius: 16px;
      background: #fff;
      border: 1px solid rgba(17,17,17,.08);
      overflow: hidden; /* <-- tu chcemy przyciąć tylko rogi */
    }

    /* Image */
    .media{
      padding: 14px;
      background: rgba(17,17,17,.02);
      height: 100%;
    }
    .media-bg{
      width: 100%;
      height: 92%;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .rating-badge{
      position:absolute;
      top: 12px;
      left: 12px;
      display:flex;
      align-items:center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(17,17,17,.08);
      font-size: 12px;
      font-weight: 700;
      color: #111;
      backdrop-filter: blur(6px);
    }
    .rating-badge .star{
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #f4b400;
    }

    .fav-btn{
      position:absolute;
      top: 10px;
      right: 10px;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(17,17,17,.08);
      backdrop-filter: blur(6px);
    }
    .fav-btn mat-icon{
      color: rgba(17,17,17,.55);
    }

    /* Body */
    .body{
      padding: 18px 22px !important;
    }

    .type-pill{
      display:inline-flex;
      width: fit-content;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .4px;
      text-transform: uppercase;
      background: rgba(33,150,243,.14);
      color: #1976d2;
      margin-bottom: 6px;
    }

    .title{
      margin: 0 0 6px 0;
      font-size: 22px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.2px;
    }
    .desc{
      margin: 0 0 10px 0;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(17,17,17,.62);
    }

    .amenities{
      display:flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-bottom: 12px;
      color: rgba(17,17,17,.65);
      font-size: 13px;
    }
    .amenity{
      display:flex;
      align-items:center;
      gap: 8px;
    }
    .amenity mat-icon{
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: rgba(17,17,17,.55);
    }

    .divider{
      margin: 12px 0;
      opacity: .75;
    }

    .bottom{
      display:flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .price-label{
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .35px;
      text-transform: uppercase;
      color: rgba(17,17,17,.55);
      margin-bottom: 6px;
    }
    .price-row{
      display:flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 6px;
    }
    .price-current{
      font-size: 28px;
      font-weight: 900;
      color: #111;
    }
    .price-old{
      font-size: 14px;
      font-weight: 700;
      color: rgba(17,17,17,.45);
      text-decoration: line-through;
    }
    .price-save{
      font-size: 12px;
      font-weight: 700;
      color: #2e7d32;
    }

    .cta{
      height: 44px;
      border-radius: 12px;
      padding: 0 18px;
      font-weight: 800;
      white-space: nowrap;
    }
    .cta-icon{
      margin-right: 8px;
    }

    .dates{
      margin-top: 12px;
    }
    .dates mat-chip mat-icon{
      margin-right: 6px;
    }

    @media (max-width: 991px){
      .bottom{
        flex-direction: column;
        align-items: stretch;
      }
      .cta{ width: 100%; justify-content: center; }
      .media-bg{ min-height: 220px; }
    }
  `,
})
export class BookingTile {
  availability = input<AvailabilityDto[]>([]);
}
