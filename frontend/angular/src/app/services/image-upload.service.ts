// services/image-upload.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private http = inject(HttpClient);
  private apiUrl = '/api/upload'; // Your server upload endpoint

  // Upload image to server
  uploadImage(file: File): Observable<{ progress: number, filename?: string, error?: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * (event.loaded / (event.total || 1)));
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          // Assuming your server returns { success: true, filename: 'image.jpg' }
          const response: any = event.body;
          if (response && response.success) {
            return { progress: 100, filename: response.filename };
          } else {
            return { progress: 100, error: response?.error || 'Upload failed' };
          }
        }
        return { progress: 0 };
      })
    );
  }

  // Get full image URL from filename
  getImageUrl(filename: string): string {
    return `/images/${filename}`;
  }
}
