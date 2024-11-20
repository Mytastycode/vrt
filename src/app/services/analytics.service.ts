import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from './data-service.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly apiUrl = 'https://analyticsdata.googleapis.com/v1beta';
  private readonly clientEmail = 'vrt-ga4@test-vrt.iam.gserviceaccount.com';
  private readonly privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDD+Qu5kLPp/Ro2\n2JQxlcbKCANkAM+88m8VjqBWl4r3i5waR1pzQBHeBBpA2hfWXvtfkBVTlmQHzHM+\nIrIrcg93U/t4HEl9KVxySfEnYjkBok4CbyOx2tYooI1VMo+bZxyTbzJ5LHhivxbJ\n1FLliKjsffBeGlfTK0CEb1nCZU4Z3hrC8quACr9OajRMAARkiot3E+oKJqyuKbtV\nzT/eLAhspoSu5mUmddigebNSO644546E+bhPVtKjkVLpbmw7LHI0D9a3y1F0ne9N\nNye2QQLr3J61rWQBotZ7NoFtpe45rg5HSJpj50gclHDCdWpX5SMDFRQqUw5UWBkn\nVu1m+5OVAgMBAAECggEAPvt+26wYTma0MpVHh2oaAdsyb8Tc/t4xek2k1T+N/4Hk\ncQOmm6ynMWHDKD2PdKuBAVT2ra8DRghcr0cKWPEm7FRW2OLKcYnF9ssx0FT+ejp1\n9M1QPPxWYKc81PlTcv/gDLgrkgsLQ70jL0loPPG/TIYrJqszt5/Kc+WvhMz3HVOW\n7UzbRdBMwnH8GJp8JpaIET/Qcd3hK4ZORVvep/DHn30N1rBz2CmpG2NZxZfPkck0\nyVDMnPxG8GGUoKueaABz3CestO8SNE+UUQn2TTg9zSgkWAl3n2UfgFDAou8qkh4S\nsRC/LDcxhUgaU1PMz5tAGdP0IRritLnnNRtjX9ST7wKBgQDi6QLyB12q+ElsxT1g\nrQU0/Hywh1Vudrg90lxmb8uxUrgc51mz7ySu79RxdMwojDH33y6ZCOqFQCcymCC8\nPwQzfN9UbV3qxAhxNf0G8GiUSyle5t8cy6HWLf4peErWmlEnDdq5OR3Uzq+0a3x/\nFJMkmN4Mp3r3qKRgivHV21LOMwKBgQDdGLKi1ofePy8PaXYc6aF9yd5chn12hcWj\nEwYiZt2h0Q1KpIX+rI6w07kurIzOVPbNLwhf6ICEDOZl1k+jJHsXI85VkVHstewd\nXYe9wv0YaAZ+erTUyTOhlXr8eIDOmJQ87cBOoRYcXWagn2kTxLCf65pZR0mvWgk0\nAeHU8YG/FwKBgGxm3xZbOH9uQD2reOgPoHYwzSzUapbsNpaqQaRaclhTaUu9ppgU\nflTolHhjUQlp+JEvWSaZINjpzhAYp0LnZA1o8ZR27zAx2Mqk/S1sermlsqz45Mvv\n6G/W5x5OrooZjP14W+6y/7Jjz4ME+qQHY0hPk30+IbvhIC5TEreVINkLAoGAZjor\nLnt+6tXQDpI2mHu1vZF/DMzqacjEbvg21+U0CMO+H4seoXhrqXrbnqcNm8FRM+HR\nP3cjJOtKBEApJkeR2ksl9g5xEL+04ocCYk0r9QL0LbrSragyBT42VVHqTJvjvqA3\nUKPOs2LENvQ+A3PoLqki/rClczxwEOnl3y2jThUCgYEAkxiRbBjgeVsQj0URZVTf\nLnvYOvx8GYwmI29QYZ8AVyxKi7RtFsUfxP9pBgEdvCAL3tkD24VWoeGq+S4ZeAr+\nbdJ+gQHbSRUUaagzjUBgY+BEO0LLX0GN3br0LevnULITMMEUas9pjusqIzCW5xFW\n5cyu8m+I/rLyyAKmiB2x3b8=\n-----END PRIVATE KEY-----\n';
  private readonly tokenUri = 'https://oauth2.googleapis.com/token';
  private readonly propertyId = '446063431';

  constructor(private http: HttpClient,
              private dataService: DataService,) {}

  private getAccessToken(): Observable<string> {
    const body = new URLSearchParams();
    body.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    body.set('client_email', this.clientEmail);
    body.set('private_key', this.privateKey);
    body.set('scope', 'https://www.googleapis.com/auth/analytics.readonly');

    return this.http
      .post<{ access_token: string }>(this.tokenUri, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(map((response) => response.access_token));
  }

//Fetch metadata through the DataService
fetchLocalMetadata(): Observable<any> {
  return this.dataService.getData();
}

// Fetch metadata from the Google Analytics API
fetchGoogleAnalyticsMetadata(): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.apiUrl}/properties/${this.propertyId}/metadata`;

        return this.http.get<any>(url, { headers });
      })
    );
  }
}