import {Component, OnInit, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../module/material.module';
import {Localization, LocalizationService} from '../service/localization.service';

@Component({
  standalone: true,
  selector: 'app-available-localization',
  imports: [CommonModule, MaterialModule],
  styles: [`
    .localization-card {
      margin: 16px;
    }

    .localization-table {
      width: 100%;
    }

    .localization-actions {
      display: flex;
      gap: 8px;
    }
  `],
  template: `
    <mat-card class="localization-card">
      <mat-card-header>
        <mat-card-title>Dostępne lokalizacje</mat-card-title>
        <mat-card-subtitle>Lista wszystkich lokalizacji w systemie</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <ng-container *ngIf="localizations(); else loading">
          <table mat-table [dataSource]="localizations()" class="mat-elevation-z2 localization-table">

            <!-- Name -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Nazwa </th>
              <td mat-cell *matCellDef="let loc"> {{ loc.name }} </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>  </th>
              <td mat-cell *matCellDef="let loc">
                <div class="localization-actions">
                  <a href="/app/{{ loc.publicId }}" target="_blank" mat-icon-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                  </a>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns();"></tr>
          </table>
        </ng-container>

        <ng-template #loading>
          <div class="loading-wrapper">
            <mat-progress-spinner
              mode="indeterminate"
              diameter="40"
              strokeWidth="4">
            </mat-progress-spinner>
          </div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
})
export class AvailableLocalization implements OnInit {
  localizations = signal<Localization[]>([]);
  displayedColumns = computed(() => ['name', 'actions']);

  constructor(
    private readonly localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.localizationService.list(1, 100).subscribe((response) => {
      this.localizations.set(response.data);
    });
  }
}
