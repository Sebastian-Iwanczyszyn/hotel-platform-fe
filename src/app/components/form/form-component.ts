import {Component, computed, input, output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card class="form-card">
      <mat-card-header>
        <mat-card-title class="mb-4">{{ title() }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <!-- Child provides the <form> and fields -->
        <ng-content></ng-content>

        <div class="button-group">
          <button mat-raised-button color="primary"
                  type="button"
                  (click)="onSave()"
                  [disabled]="form().invalid">
            {{ saveText() }}
          </button>

          <button mat-button type="button" (click)="cancel.emit()">
            {{ cancelText() }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .form-card {
      background-color: #FFF;
    }
  `,
})
export class FormComponent {
  // signal inputs
  title = input.required<string>();
  form = input.required<FormGroup>();
  saveText = input('Zapisz');
  cancelText = input('Anuluj');

  // signal outputs
  save = output<void>();
  cancel = output<void>();

  // Make form validity reactive via statusChanges -> signal
  // private status = toSignal(
  //   this.form().statusChanges.pipe(
  //     startWith(this.form().status),
  //     map(() => this.form().status)
  //   ),
  //   { initialValue: this.form().status }
  // );
  //
  // isInvalid = computed(() => this.status() === 'INVALID');

  onSave(): void {
    const fg = this.form();
    if (fg.invalid) {
      fg.markAllAsTouched();
      return;
    }
    this.save.emit();
  }
}
