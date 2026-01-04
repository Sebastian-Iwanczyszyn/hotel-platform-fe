import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../module/material.module'; // adjust path

@Component({
  standalone: true,
  selector: 'app-page-topbar',
  imports: [CommonModule, RouterLink, MaterialModule],
  template: `
    <mat-card class="topbar" appearance="outlined">
      <mat-card-content class="topbar-content">
        <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <!-- Left -->
          <div class="title-wrap">
            <div class="title">{{ title() }}</div>
            @if (subtitle()) {
              <div class="subtitle">{{ subtitle() }}</div>
            }
          </div>

          <!-- Right actions -->
          <div class="actions d-flex align-items-center gap-2 ms-auto">
            @if (showExport()) {
              <button
                mat-stroked-button
                type="button"
                class="btn-export"
                (click)="exportClick.emit()"
              >
                <mat-icon>cloud_download</mat-icon>
                {{ exportLabel() }}
              </button>
            }

            @if (showPrimary()) {
              <button
                mat-raised-button
                color="primary"
                class="btn-primary"
                [routerLink]="primaryLink()"
                (click)="primaryClick.emit()"
              >
                <mat-icon>add</mat-icon>
                {{ primaryLabel() }}
              </button>
            }
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .topbar{
      background: #fff;
      border-color: rgba(0,0,0,.06);
    }

    .topbar-content{
      padding: 16px 18px;
    }

    .title{
      font-size: 22px;
      line-height: 1.2;
      color: rgba(0,0,0,.86);
      margin-bottom: 2px;
      letter-spacing: -0.2px;
    }

    .subtitle{
      font-size: 13px;
      color: rgba(0,0,0,.55);
    }

    .actions button{
      border-radius: 12px;
      height: 42px;
      padding: 0 14px;
    }

    .btn-export mat-icon,
    .btn-primary mat-icon{
      margin-right: 6px;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }

    /* Slightly “pill” feel like the screenshot */
    .btn-export{
      border-color: rgba(0,0,0,.10);
      background: #fff;
    }
  `]
})
export class PageTopbarComponent {
  // text
  title = input<string>('Title');
  subtitle = input<string>('');

  // export button
  showExport = input<boolean>(false);
  exportLabel = input<string>('Export');
  exportClick = output<void>();

  // primary button
  showPrimary = input<boolean>(false);
  primaryLabel = input<string>('New Booking');
  primaryLink = input<any[] | string>(['/bookings/create']);
  primaryClick = output<void>();
}
