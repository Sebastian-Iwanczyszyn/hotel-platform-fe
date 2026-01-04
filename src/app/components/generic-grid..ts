import {Component, input, computed, output, inject} from '@angular/core';
import {MaterialModule} from '../module/material.module';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {GridDeletable} from '../service/grid-deletable';
import {OrderStatePipe} from '../pipe/order-state.pipe';
import {MatDialog} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import {BookingStatePipe} from '../pipe/booking-state.pipe';

export interface ColumnDefinition {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'date-time' | 'price' | 'order-state' | 'boolean' | 'booking-state';
}

export interface Pagination<T> {
  data: T[],
  page: number;
  totalPages: number;
  totalItems: number;
}

@Component({
  standalone: true,
  selector: 'app-generic-grid',
  imports: [MaterialModule, CommonModule, RouterLink, OrderStatePipe, BookingStatePipe],
  styles: `
  table {
    width: 100%;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
  }

  .status-created {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .status-payment_method_updated {
    background-color: #fff3e0;
    color: #f57c00;
  }

  .status-processing {
    background-color: #fff9c4;
    color: #f57f17;
  }

  .status-completed {
    background-color: #e8f5e9;
    color: #388e3c;
  }

  .status-failed {
    background-color: #ffebee;
    color: #d32f2f;
  }

  .status-canceled {
    background-color: #f5f5f5;
    color: #616161;
  }
`,
  template: `
    <div class="mat-elevation-z8">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-end p-3">
            @if (createButton()) {
              <button [routerLink]="'create'" mat-raised-button>
                <mat-icon>add</mat-icon>
                Dodaj
              </button>
            }
          </div>
        </div>
      </div>
      <table mat-table [dataSource]="paginationParams().data">
        @for (column of visibleColumns(); track column.key) {
          <ng-container [matColumnDef]="column.key">
            <th mat-header-cell *matHeaderCellDef>{{ column.label }}</th>
            @if (column.type === 'price') {
              <td mat-cell *matCellDef="let row">{{ row[column.key] }} zł</td>
            } @else if (column.type === 'order-state') {
              <td mat-cell *matCellDef="let row">
                <span class="status-badge" [class]="'status-' + row[column.key].toLowerCase()">
                  {{ row[column.key] | orderState }}
                </span>
              </td>
            } @else if (column.type === 'date') {
              <td mat-cell *matCellDef="let row">
                {{ row[column.key] | date:'dd MMMM yyyy' }}
              </td>
            } @else if (column.type === 'booking-state') {
              <td mat-cell *matCellDef="let row">
                <mat-chip [class]="'status-' + row[column.key].toLowerCase()">
                  {{ row[column.key] | bookingState }}
                </mat-chip>
              </td>
            } @else if (column.type === 'boolean') {
              <td mat-cell *matCellDef="let row">
                <mat-chip [color]="row[column.key] ? 'primary' : 'warn'">
                  {{ row[column.key] ? 'TAK' : 'NIE' }}
                </mat-chip>
              </td>
            } @else {
              <td mat-cell *matCellDef="let row">{{ row[column.key] }}</td>
            }
          </ng-container>
        }

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row" style="text-align: right;">
            @if (isEditable()) {
              <button mat-icon-button>
                <mat-icon [routerLink]="['view', row.id]">edit</mat-icon>
              </button>
            }
            @if (deletable()) {
              <button (click)="delete(row.id)" mat-icon-button>
                <mat-icon>delete</mat-icon>
              </button>
            }
            @if (preview()) {
              <button (click)="showPreview(row)" mat-icon-button>
                <mat-icon>text_snippet</mat-icon>
              </button>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>

      <mat-paginator
        [pageIndex]="paginationParams().page"
        [pageSize]="paginationParams().totalPages"
        [length]="paginationParams().totalItems"
        [pageSizeOptions]="[5, 10, 25, 50]"
        showFirstLastButtons
      >
      </mat-paginator>
    </div>
  `,
})
export class GenericGrid {
  private dialog = inject(MatDialog);
  visibleColumns = input<ColumnDefinition[]>([]);
  isEditable = input<boolean>(true);
  deletable = input<GridDeletable|undefined>(undefined);
  preview = input<ComponentType<any>|false>(false);
  createButton = input<boolean>(true);
  paginationParams = input<Pagination<any>>({
    data: [],
    page: 0,
    totalPages: 10,
    totalItems: 0
  });
  onDelete = output<boolean>();

  delete(id: string) {
    this.deletable()?.delete(id).subscribe(res => {
      this.onDelete.emit(true);
    })
  }

  showPreview(row: any) {
    if (this.preview() === false) {
      return;
    }

    const component = this.preview() as ComponentType<any>;

    const dialogRef = this.dialog.open(component, {
      width: '800px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  displayedColumns = computed(() => {
    const cols = this.visibleColumns().map(col => col.key);
    if (this.isEditable() || this.deletable() || this.preview()) {
      cols.push('action');
    }
    return cols;
  });
}
