import { Component, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

type Trend = 'up' | 'down' | 'flat';

interface MetricCard {
  key: string;
  title: string;
  value: string;
  sub: string;
  icon: string;
  iconBgClass: string;
  trend: Trend;
  deltaText: string;
}

@Component({
  selector: 'app-kpi-overview',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  template: `
    <div class="kpi-wrap">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div class="d-flex align-items-center gap-2 ms-auto">
          <button
            mat-stroked-button
            type="button"
            class="refresh-btn"
            (click)="refresh()"
            matTooltip="Refresh metrics"
          >
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>

          <div class="updated text-muted d-flex align-items-center gap-1">
            <mat-icon class="updated-ic">schedule</mat-icon>
            <span>Updated {{ lastUpdated() | date : 'shortTime' }}</span>
          </div>
        </div>
      </div>

      <!-- Cards grid (Bootstrap) -->
      <div class="row g-3">
        <div class="col-12 col-sm-6 col-lg-3" *ngFor="let m of metrics()">
          <mat-card class="kpi-card h-100" appearance="outlined">
            <mat-card-content class="p-0">
              <div class="d-flex align-items-start justify-content-between">
                <div class="kpi-icon" [ngClass]="m.iconBgClass" aria-hidden="true">
                  <mat-icon>{{ m.icon }}</mat-icon>
                </div>

<!--                <mat-chip-->
<!--                  class="delta-chip"-->
<!--                  [ngClass]="trendChipClass(m.trend)"-->
<!--                  matTooltipPosition="above"-->
<!--                >-->
<!--                  <mat-icon class="delta-ic">{{ trendIcon(m.trend) }}</mat-icon>-->
<!--                  {{ m.deltaText }}-->
<!--                </mat-chip>-->
              </div>

              <div class="mt-3">
                <div class="kpi-title">{{ m.title }}</div>
                <div class="kpi-value">{{ m.value }}</div>
                <div class="kpi-sub text-muted">{{ m.sub }}</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .kpi-wrap{
      padding: 12px;
    }

    /* Tabs look more like a segmented control */
    .range-tabs ::ng-deep .mat-mdc-tab-header{
      border: 1px solid rgba(0,0,0,.08);
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
    }
    .range-tabs ::ng-deep .mat-mdc-tab{
      min-width: 130px;
    }
    .range-tabs ::ng-deep .mdc-tab{
      height: 42px;
    }
    .range-tabs ::ng-deep .mdc-tab__text-label{
      font-weight: 600;
      font-size: 13px;
      color: rgba(0,0,0,.65);
    }
    .range-tabs ::ng-deep .mdc-tab--active .mdc-tab__text-label{
      color: rgba(0,0,0,.85);
    }
    .range-tabs ::ng-deep .mdc-tab-indicator__content--underline{
      border-top-width: 0 !important; /* remove underline */
    }
    .range-tabs ::ng-deep .mdc-tab--active{
      background: rgba(33, 150, 243, .08);
    }

    .refresh-btn mat-icon{
      margin-right: 6px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .updated{
      font-size: 13px;
      user-select: none;
    }
    .updated-ic{
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: .75;
    }

    /* Card */
    .kpi-card{
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,.04);
      padding: 16px;
    }

    .kpi-icon{
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: grid;
      place-items: center;
    }
    .kpi-icon mat-icon{
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .icon-bg--blue   { background: rgba(33,150,243,.12); }
    .icon-bg--purple { background: rgba(156,39,176,.12); }
    .icon-bg--orange { background: rgba(255,152,0,.12); }
    .icon-bg--amber  { background: rgba(255,193,7,.16); }

    .delta-chip{
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      padding: 2px 8px;
      height: 28px;
    }
    .delta-ic{
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

    .chip--up{
      background: rgba(76,175,80,.12);
      color: rgb(46,125,50);
    }
    .chip--down{
      background: rgba(244,67,54,.10);
      color: rgb(198,40,40);
    }
    .chip--flat{
      background: rgba(0,0,0,.06);
      color: rgba(0,0,0,.70);
    }

    .kpi-title{
      font-size: 13px;
      font-weight: 700;
      color: rgba(0,0,0,.60);
      letter-spacing: .2px;
    }

    .kpi-value{
      margin-top: 4px;
      font-size: 28px;
      font-weight: 800;
      color: rgba(0,0,0,.88);
      line-height: 1.1;
    }

    .kpi-sub{
      margin-top: 6px;
      font-size: 12.5px;
    }

    /* Nice hover */
    .kpi-card{
      transition: transform .12s ease, box-shadow .12s ease;
    }
    .kpi-card:hover{
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(0,0,0,.06);
    }
  `]
})
export class KpiOverviewComponent {
  lastUpdated = signal(new Date());

  metrics = computed<MetricCard[]>(() => {
    return [
      {
        key: 'revenue',
        title: 'Total Revenue',
        value: '$124,500',
        sub: 'vs. $110,650 last period',
        icon: 'attach_money',
        iconBgClass: 'icon-bg--blue',
        trend: 'up',
        deltaText: '+12.5%',
      },
      {
        key: 'occupancy',
        title: 'Occupancy Rate',
        value: '85%',
        sub: 'vs. 87% last period',
        icon: 'hotel',
        iconBgClass: 'icon-bg--purple',
        trend: 'down',
        deltaText: '-2.1%',
      },
      {
        key: 'bookings',
        title: 'Active Bookings',
        value: '42',
        sub: 'Current active stays',
        icon: 'receipt_long',
        iconBgClass: 'icon-bg--orange',
        trend: 'up',
        deltaText: '+5.4%',
      },
      {
        key: 'rating',
        title: 'Avg Rating',
        value: '4.8',
        sub: 'Based on 128 reviews',
        icon: 'star',
        iconBgClass: 'icon-bg--amber',
        trend: 'flat',
        deltaText: '+0.1',
      },
    ];
  });

  refresh() {
    // Replace with API call; demo just updates timestamp
    this.lastUpdated.set(new Date());
  }

  trendChipClass(t: Trend) {
    return { up: 'chip--up', down: 'chip--down', flat: 'chip--flat' }[t];
  }

  trendIcon(t: Trend) {
    return { up: 'trending_up', down: 'trending_down', flat: 'trending_flat' }[t];
  }
}
