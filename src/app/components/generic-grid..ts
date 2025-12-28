import {Component, input, computed, output} from '@angular/core';
import {MaterialModule} from '../module/material.module';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {GridDeletable} from '../service/grid-deletable';

export interface ColumnDefinition {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date';
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
  imports: [MaterialModule, CommonModule, RouterLink],
  styles: `
  table {
    width: 100%;
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
            <td mat-cell *matCellDef="let row">{{ row[column.key] }}</td>
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
  visibleColumns = input<ColumnDefinition[]>([]);
  isEditable = input<boolean>(true);
  deletable = input<GridDeletable|undefined>(undefined);
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

  displayedColumns = computed(() => {
    const cols = this.visibleColumns().map(col => col.key);
    if (this.isEditable() || this.deletable()) {
      cols.push('action');
    }
    return cols;
  });
}
