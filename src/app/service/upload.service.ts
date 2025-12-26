import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly apiUrl = `${environment.API_URL}/admin/uploads`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<UploadedImage> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadedImage>(`${this.apiUrl}/upload-image`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-image/${id}`);
  }
}
