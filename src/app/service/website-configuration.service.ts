import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ViewUploaded} from '../model/upload';

export interface WebsiteConfiguration {
  title: string|null;
  subTitle: string|null;
  viewUploaded: ViewUploaded|null;
}

export interface UpdateWebsiteConfigurationDto {
  backgroundImageId: string;
  configuration: { title: string, subTitle: string };
}

@Injectable({
  providedIn: 'root',
})
export class WebsiteConfigurationService {
  private readonly apiUrl = `${environment.API_URL}/admin/website-configurations`;

  constructor(private http: HttpClient) {
  }

  get(): Observable<WebsiteConfiguration> {
    return this.http.get<WebsiteConfiguration>(this.apiUrl);
  }

  update(data: UpdateWebsiteConfigurationDto): Observable<WebsiteConfiguration> {
    return this.http.put<WebsiteConfiguration>(this.apiUrl, data);
  }
}
