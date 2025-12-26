import {CommonModule} from '@angular/common';
import {Component, computed, signal, input, output, inject, effect} from '@angular/core';
import {UploadService} from '../service/upload.service';
import {ViewUploaded} from '../model/upload';

@Component({
  standalone: true,
  selector: 'upload-file',
  imports: [CommonModule],
  template: `
    <div class="upload-root">
      <div
        class="dropzone"
        [class.dragover]="dragOver()"
        [class.has-preview]="hasPreview()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <div class="dropzone-inner" *ngIf="!hasPreview()">
          <svg class="upload-icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M38 18L24 4L10 18" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M24 4V30" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
            <path d="M42 28V40C42 41.1046 41.1046 42 40 42H8C6.89543 42 6 41.1046 6 40V28" stroke="#3b82f6"
                  stroke-width="3" stroke-linecap="round"/>
            <circle cx="38" cy="10" r="6" fill="#60a5fa"/>
          </svg>

          <div class="title">
            Przeciągnij zdjęcie tutaj lub
            <input
              #fileInput
              type="file"
              [accept]="accept()"
              (change)="onFilePicked($event)"
              hidden
            />
            <button type="button" class="link-btn" (click)="fileInput.click()" [disabled]="uploading()">
              wyszukaj
            </button>
          </div>

          <div class="subtitle">{{ helperText() }}</div>

          <div class="error" *ngIf="error()">{{ error() }}</div>
        </div>
      </div>

      <div class="preview" *ngIf="hasPreview()">
        <img [src]="displayUrl()!" alt="Preview"/>
        <button
          type="button"
          class="btn-remove"
          (click)="clear()"
          [disabled]="uploading()"
          title="Usuń obraz"
        >
          ✕
        </button>
        <div class="preview-meta">
          <span *ngIf="uploading()" class="uploading-indicator"> • Wysyłanie...</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .upload-root {
      display: grid;
      gap: 12px;
    }

    .dropzone {
      border: 2px dashed #d1d5db;
      border-radius: 16px;
      padding: 48px 24px;
      background: #fafafa;
      transition: all 150ms ease;
      cursor: pointer;
    }

    .dropzone.dragover {
      background: #eff6ff;
      border-color: #3b82f6;
    }

    .dropzone.has-preview {
      border: none;
      padding: 0;
      background: transparent;
      cursor: default;
    }

    .dropzone-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
    }

    .upload-icon {
      margin-bottom: 8px;
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .subtitle {
      font-size: 13px;
      color: #6b7280;
    }

    .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      transition: color 120ms ease;
    }

    .link-btn:hover:not(:disabled) {
      color: #2563eb;
      text-decoration: underline;
    }

    .link-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .error {
      color: #dc2626;
      font-size: 13px;
      margin-top: 4px;
    }

    .preview {
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px;
      background: #fff;
      max-width: 420px;
    }

    .preview img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }

    .btn-remove {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-remove:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.85);
    }

    .btn-remove:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .preview-meta {
      margin-top: 12px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }

    .uploading-indicator {
      color: #3b82f6;
      font-weight: 500;
    }
  `,
})
export class UploadFile {
  private readonly service = inject(UploadService);

  // Inputs
  label = input('Upload file');
  helperText = input('Supports: JPG, JPEG2000, PNG');
  accept = input<string>('image/*');
  viewUploaded = input<ViewUploaded | null>(null);

  // Output
  uploaded = output<string | null>();

  // State
  private _file = signal<File | null>(null);
  fileName = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  uploadedId = signal<string | null>(null);
  externalImageUrl = signal<string | null>(null);
  uploading = signal(false);
  error = signal<string | null>(null);
  dragOver = signal(false);

  // Computed
  hasPreview = computed(() => !!this.displayUrl());
  displayUrl = computed(() => this.previewUrl() || this.externalImageUrl());

  constructor() {
    // Watch for external image changes
    effect(() => {
      const id = this.viewUploaded()?.id;
      const path = this.viewUploaded()?.url;

      if (id && path) {
        this.loadExternalImage(id, path);
      } else if (!id && !path) {
        this.clearExternalImage();
      }
    });
  }

  private loadExternalImage(id: string, path: string): void {
    this.uploadedId.set(id);
    this.externalImageUrl.set(path);
    this.fileName.set(path.split('/').pop() || 'image');
    this.previewUrl.set(null);
    this._file.set(null);
  }

  private clearExternalImage(): void {
    if (!this._file()) {
      this.externalImageUrl.set(null);
      this.uploadedId.set(null);
      this.fileName.set(null);
    }
  }

  onFilePicked(evt: Event): void {
    const inputEl = evt.target as HTMLInputElement;
    const f = inputEl.files?.[0] ?? null;
    if (!f) return;

    this.setFile(f);
    inputEl.value = '';
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);

    const f = e.dataTransfer?.files?.[0] ?? null;
    if (!f) return;

    if (this.accept() && !this.fileMatchesAccept(f, this.accept())) {
      this.error.set(`Typ pliku niedozwolony. Dozwolone: ${this.accept()}`);
      return;
    }

    this.setFile(f);
  }

  private setFile(f: File): void {
    this.error.set(null);
    this._file.set(f);
    this.fileName.set(f.name);

    // Clear external image
    this.externalImageUrl.set(null);

    // Reset upload state
    this.uploadedId.set(null);
    this.uploaded.emit(null);

    this.revokePreview();
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      this.previewUrl.set(url);
    } else {
      this.previewUrl.set(null);
    }

    this.upload();
  }

  private upload(): void {
    const f = this._file();
    if (!f) return;

    this.uploading.set(true);
    this.error.set(null);

    this.service.uploadImage(f).subscribe({
      next: (response) => {
        this.uploadedId.set(response.id);
        this.uploaded.emit(response.id);
      },
      error: (err) => {
        this.error.set('Błąd podczas wysyłania pliku');
        console.error('Upload error:', err);
      },
      complete: () => {
        this.uploading.set(false);
      }
    });
  }

  clear(): void {
    const idToDelete = this.uploadedId();

    this._file.set(null);
    this.fileName.set(null);
    this.revokePreview();
    this.previewUrl.set(null);
    this.externalImageUrl.set(null);
    this.uploadedId.set(null);
    this.error.set(null);

    if (idToDelete) {
      this.service.delete(idToDelete).subscribe({
        error: (err) => console.error('Delete error:', err)
      });
    }

    this.uploaded.emit(null);
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }

  private fileMatchesAccept(file: File, accept: string): boolean {
    const parts = accept.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return true;

    return parts.some(rule => {
      if (rule === '*/*') return true;
      if (rule.endsWith('/*')) {
        const prefix = rule.slice(0, rule.length - 1);
        return file.type.startsWith(prefix);
      }
      if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase());
      return file.type === rule;
    });
  }
}
