import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormComponent} from './form-component';
import {WebsiteConfigurationService, UpdateWebsiteConfigurationDto} from '../../service/website-configuration.service';
import {UploadFile} from '../upload-file';
import {ViewUploaded} from '../../model/upload';

@Component({
  standalone: true,
  selector: 'website-design-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormComponent,
    UploadFile,
  ],
  template: `
    <form-component
      [title]="'Konfiguracja strony'"
      [form]="form"
      (save)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tytuł</mat-label>
          <input matInput formControlName="title" placeholder="Wpisz tytuł"/>
          @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
            <mat-error>Tytuł jest wymagany</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Podtytuł</mat-label>
          <input matInput formControlName="subTitle" placeholder="Wpisz podtytuł"/>
          @if (form.get('subTitle')?.hasError('required') && form.get('subTitle')?.touched) {
            <mat-error>Podtytuł jest wymagany</mat-error>
          }
        </mat-form-field>

        <upload-file [viewUploaded]="uploaded" (uploaded)="onUpload($event)"></upload-file>
      </form>
    </form-component>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      width: 100%;
    }
  `,
})
export class WebsiteDesignForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(WebsiteConfigurationService);
  uploaded: ViewUploaded|null = null;

  readonly form: FormGroup = this.fb.group({
    title: [null],
    subTitle: [null],
    backgroundImageId: [null],
  });

  ngOnInit(): void {
    this.service.get().subscribe(data => {
      this.form.patchValue({
        title: data.title,
        subTitle: data.subTitle,
      });
      this.uploaded = data.viewUploaded;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.service.update(this.form.value as UpdateWebsiteConfigurationDto).subscribe(() => {
    });
  }

  onCancel(): void {
  }

  onUpload(id: string|null): void {
    this.form.patchValue({ backgroundImageId: id });
  }
}
