import {
  Component, input, computed, output, inject, TemplateRef, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';

import { MaterialModule } from '../module/material.module';
import { GridDeletable } from '../service/grid-deletable';
import { OrderStatePipe } from '../pipe/order-state.pipe';
import { BookingStatePipe } from '../pipe/booking-state.pipe';

export interface ColumnDefinition {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'date-time' | 'price' | 'order-state' | 'boolean' | 'booking-state';
}
export interface Pagination<T> {
  data: T[];
  page: number;   // API 1-based page
  limit: number;
  totalItems: number;
  previousPage: boolean | null;
  nextPage: boolean | null;
}

export const defaultPagination: Pagination<any> = {
  data: [],
  page: 1,
  previousPage: null,
  nextPage: null,
  limit: 25,
  totalItems: 0,
};

@Component({
  standalone: true,
  selector: 'app-generic-grid',
  imports: [MaterialModule, CommonModule, RouterLink, OrderStatePipe, BookingStatePipe],
  template: `
    <mat-card>
      <mat-card-content>
        <!-- TOP BAR (like mock) -->
        @if (showHeader()) {
          <mat-card class="topbar mb-3" appearance="outlined">
            <mat-card-content class="topbar-content">
              <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div>
                  <div class="topbar-title mb-3">{{ title() }}</div>
                  @if (subtitle()) {
                    <div class="topbar-subtitle">{{ subtitle() }}</div>
                  }
                </div>

                <div class="d-flex align-items-center gap-2 ms-auto">
                  @if (showExport()) {
                    <button mat-stroked-button class="topbar-btn soft" type="button" (click)="exportClick.emit()">
                      <mat-icon>cloud_download</mat-icon>
                      {{ exportLabel() }}
                    </button>
                  }

                  @if (createButton()) {
                    <button mat-stroked-button color="primary" class="topbar-btn primary"
                            [routerLink]="createLink()">
                      <mat-icon>add</mat-icon>
                      {{ createLabel() }}
                    </button>
                  }
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- GRID CARD -->
        <mat-card class="grid-card" appearance="outlined">

          <!-- TOOLBAR STRIP -->
          <div class="toolbar-strip">
            <div class="row g-2 align-items-center">
              <div class="col-12 col-lg-6">
                <!-- Soft pill search -->
                <mat-form-field class="search-pill w-100" appearance="fill">
                  <mat-icon matPrefix>search</mat-icon>
                  <input
                    matInput
                    [placeholder]="searchPlaceholder()"
                    [value]="searchValue()"
                    (input)="onSearch(($any($event.target).value || '').toString())"
                  />
                  @if (searchValue()) {
                    <button mat-icon-button matSuffix (click)="clearSearch()" aria-label="Clear search">
                      <mat-icon>close</mat-icon>
                    </button>
                  }
                </mat-form-field>
              </div>

              <!-- right side filters slot (optional) -->
              <div class="col-12 col-lg-6 d-flex justify-content-lg-end">
                @if (filtersTpl()) {
                  <div class="filters-wrap">
                    <ng-container [ngTemplateOutlet]="filtersTpl()"></ng-container>
                  </div>
                }
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- TABLE -->
          <div class="table-wrap">
            <table mat-table [dataSource]="paginationParams().data" class="grid-table">

              @if (selectable()) {
                <ng-container matColumnDef="_select">
                  <th mat-header-cell *matHeaderCellDef class="select-col">
                    <mat-checkbox
                      [checked]="allSelected()"
                      [indeterminate]="someSelected()"
                      (change)="toggleAll($event.checked)"
                    />
                  </th>
                  <td mat-cell *matCellDef="let row" class="select-col">
                    <mat-checkbox
                      [checked]="isSelected(row)"
                      (change)="toggleOne(row, $event.checked)"
                    />
                  </td>
                </ng-container>
              }

              @for (column of visibleColumns(); track column.key) {
                <ng-container [matColumnDef]="column.key">
                  <th mat-header-cell *matHeaderCellDef>{{ column.label }}</th>

                  @if (column.type === 'price') {
                    <td mat-cell *matCellDef="let row">{{ row[column.key] }} zł</td>
                  } @else if (column.type === 'order-state') {
                    <td mat-cell *matCellDef="let row">
                  <span class="status-pill" [ngClass]="'status-' + (row[column.key] || '').toLowerCase()">
                    {{ row[column.key] | orderState }}
                  </span>
                    </td>
                  } @else if (column.type === 'booking-state') {
                    <td mat-cell *matCellDef="let row">
                  <span class="chip-pill" [ngClass]="'chip-' + (row[column.key] || '').toLowerCase()">
                    {{ row[column.key] | bookingState }}
                  </span>
                    </td>
                  } @else if (column.type === 'boolean') {
                    <td mat-cell *matCellDef="let row">
                  <span class="chip-pill" [ngClass]="row[column.key] ? 'chip-yes' : 'chip-no'">
                    {{ row[column.key] ? 'TAK' : 'NIE' }}
                  </span>
                    </td>
                  } @else if (column.type === 'date') {
                    <td mat-cell *matCellDef="let row">{{ row[column.key] | date:'dd MMM yyyy' }}</td>
                  } @else if (column.type === 'date-time') {
                    <td mat-cell *matCellDef="let row">{{ row[column.key] | date:'dd MMM yyyy, HH:mm' }}</td>
                  } @else {
                    <td mat-cell *matCellDef="let row">{{ row[column.key] }}</td>
                  }
                </ng-container>
              }

              <ng-container matColumnDef="_actions">
                <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
                <td mat-cell *matCellDef="let row" class="actions-col">
                  <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Row actions">
                    <mat-icon>more_horiz</mat-icon>
                  </button>

                  <mat-menu #menu="matMenu">
                    @if (isEditable()) {
                      <button mat-menu-item [routerLink]="['view', row.id]">
                        <mat-icon>edit</mat-icon>
                        <span>Edytuj</span>
                      </button>
                    }
                    @if (preview()) {
                      <button mat-menu-item (click)="showPreview(row)">
                        <mat-icon>text_snippet</mat-icon>
                        <span>Podgląd</span>
                      </button>
                    }
                    @if (deletable()) {
                      <button mat-menu-item class="danger" (click)="delete(row.id)">
                        <mat-icon>delete</mat-icon>
                        <span>Usuń</span>
                      </button>
                    }
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns()" class="header-row"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns()" class="data-row"></tr>
            </table>
          </div>

          <mat-divider></mat-divider>

          <mat-paginator
            class="paginator"
            [pageIndex]="uiPageIndex()"
            [length]="paginationParams().totalItems"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50, 100]"
            showFirstLastButtons
            (page)="onPaginator($event)"
          ></mat-paginator>
        </mat-card>
      </mat-card-content>

    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* ===== TOPBAR ===== */
    .topbar {
      border-radius: 16px;
      background: #fff;
      border-color: rgba(0, 0, 0, .06);
    }

    .topbar-content {
      padding: 16px 18px;
    }

    .topbar-title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.2px;
      color: rgba(0, 0, 0, .86);
      margin-bottom: 2px;
    }

    .topbar-subtitle {
      font-size: 16px;
      color: rgba(0, 0, 0, .55);
    }

    .topbar-btn {
      height: 40px;
      border-radius: 12px;
      padding: 0 14px;
    }

    .topbar-btn mat-icon {
      margin-right: 6px;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }

    .topbar-btn.soft {
      border-color: rgba(0, 0, 0, .10);
      background: #fff;
    }

    .topbar-btn.primary {
      background: rgba(25, 118, 210, .06);
      border-color: rgba(25, 118, 210, .25);
    }

    /* ===== GRID CARD ===== */
    .grid-card {
      border-radius: 18px;
      overflow: hidden;
      background: #fff;
      border-color: rgba(0, 0, 0, .10);
    }

    /* TOOLBAR STRIP – less empty space */
    .toolbar-strip {
      padding: 14px 16px 10px 16px;
      background: #fff;
    }

    /* ===== SEARCH PILL (this is the main fix) ===== */
    /* make Material "fill" look like a rounded soft pill */
    :host ::ng-deep .search-pill .mat-mdc-text-field-wrapper {
      border-radius: 14px !important;
      background: #f6f8fc !important;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .10);
    }

    :host ::ng-deep .search-pill .mat-mdc-form-field-flex {
      padding-left: 10px;
      padding-right: 6px;
    }

    :host ::ng-deep .search-pill .mat-mdc-form-field-infix {
      padding-top: 14px;
      padding-bottom: 14px;
      min-height: 52px;
    }

    :host ::ng-deep .search-pill .mdc-line-ripple,
    :host ::ng-deep .search-pill .mdc-floating-label {
      display: none !important;
    }

    :host ::ng-deep .search-pill .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    :host ::ng-deep .search-pill.mat-focused .mat-mdc-text-field-wrapper {
      box-shadow: inset 0 0 0 2px rgba(25, 118, 210, .35);
      background: #fff !important;
    }

    :host ::ng-deep .search-pill mat-icon {
      opacity: .65;
    }

    .filters-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    /* ===== TABLE ===== */
    .table-wrap {
      width: 100%;
      overflow: auto;
      background: #fff;
    }

    table.grid-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .header-row th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #fbfbfd;
      font-weight: 800;
      font-size: 12px;
      color: rgba(0, 0, 0, .55);
      letter-spacing: .35px;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(0, 0, 0, .06);
      padding-top: 14px;
      padding-bottom: 14px;
    }

    .data-row td {
      border-bottom: 1px solid rgba(0, 0, 0, .06);
      padding-top: 18px;
      padding-bottom: 18px;
      font-size: 14px;
    }

    .data-row:nth-child(2n) td {
      background: rgba(25, 118, 210, .02);
    }

    .data-row:hover td {
      background: rgba(25, 118, 210, .05) !important;
    }

    .select-col {
      width: 48px;
      padding-left: 12px;
      padding-right: 8px;
    }

    .actions-col {
      width: 64px;
      text-align: right;
      padding-right: 10px;
    }

    /* pills like in mock (not MatChip, simpler) */
    .status-pill, .chip-pill {
      display: inline-flex;
      align-items: center;
      padding: 7px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      line-height: 1;
      border: 1px solid rgba(0, 0, 0, .14);
      background: #fff;
      color: rgba(0, 0, 0, .75);
    }

    .chip-yes {
      background: rgba(25, 118, 210, .08);
      border-color: rgba(25, 118, 210, .22);
      color: #1565c0;
    }

    .chip-no {
      background: rgba(244, 67, 54, .08);
      border-color: rgba(244, 67, 54, .22);
      color: #c62828;
    }

    /* danger menu */
    :host ::ng-deep .mat-mdc-menu-item.danger {
      color: #c62828;
    }

    /* paginator – keep clean */
    .paginator {
      background: #fff;
      padding: 8px 8px;
    }
  `],
})
export class GenericGrid {
  private dialog = inject(MatDialog);

  // header inputs
  showHeader = input<boolean>(true);
  title = input<string>('');
  subtitle = input<string>('');

  showExport = input<boolean>(false);
  exportLabel = input<string>('Export');
  exportClick = output<void>();

  createButton = input<boolean>(true);
  createLabel = input<string>('Dodaj');
  createLink = input<any[] | string>('create');

  // grid inputs
  visibleColumns = input<ColumnDefinition[]>([]);
  isEditable = input<boolean>(true);
  deletable = input<GridDeletable | undefined>(undefined);
  preview = input<ComponentType<any> | false>(false);

  filtersTpl = input<TemplateRef<any> | null>(null);

  searchPlaceholder = input<string>('Szukaj...');
  initialSearch = input<string>('');
  selectable = input<boolean>(false);

  paginationParams = input<Pagination<any>>({
    data: [],
    page: 1,
    totalItems: 0,
    limit: 25,
    nextPage: false,
    previousPage: false,
  });

  // outputs
  onDelete = output<boolean>();
  searchChange = output<string>();
  pageChange = output<{ page: number; limit: number }>();
  selectionChange = output<any[]>();

  private _search = signal<string>('');
  searchValue = computed(() => this._search() || this.initialSearch());

  private selected = signal<any[]>([]);

  displayedColumns = computed(() => {
    const cols: string[] = [];
    if (this.selectable()) cols.push('_select');
    cols.push(...this.visibleColumns().map(c => c.key));
    if (this.isEditable() || this.deletable() || this.preview()) cols.push('_actions');
    return cols;
  });

  uiPageIndex = computed(() => Math.max(0, (this.paginationParams().page ?? 1) - 1));
  pageSize = computed(() => this.paginationParams().limit ?? 25);

  onPaginator(e: any) {
    this.pageChange.emit({ page: e.pageIndex + 1, limit: e.pageSize });
  }

  // selection
  isSelected(row: any) { return this.selected().some(r => r?.id === row?.id); }
  allSelected() {
    const data = this.paginationParams().data || [];
    return data.length > 0 && data.every(r => this.isSelected(r));
  }
  someSelected() {
    const data = this.paginationParams().data || [];
    const count = data.filter(r => this.isSelected(r)).length;
    return count > 0 && count < data.length;
  }
  toggleOne(row: any, checked: boolean) {
    const current = this.selected();
    const next = checked
      ? [...current, row].filter((v, i, a) => a.findIndex(x => x?.id === v?.id) === i)
      : current.filter(r => r?.id !== row?.id);
    this.selected.set(next);
    this.selectionChange.emit(next);
  }
  toggleAll(checked: boolean) {
    const data = this.paginationParams().data || [];
    const next = checked ? [...data] : [];
    this.selected.set(next);
    this.selectionChange.emit(next);
  }

  // search
  onSearch(value: string) { this._search.set(value); this.searchChange.emit(value); }
  clearSearch() { this._search.set(''); this.searchChange.emit(''); }

  // actions
  delete(id: string) {
    this.deletable()?.delete(id).subscribe(() => this.onDelete.emit(true));
  }
  showPreview(row: any) {
    if (this.preview() === false) return;
    const component = this.preview() as ComponentType<any>;
    this.dialog.open(component, { width: '800px', data: row });
  }
}
