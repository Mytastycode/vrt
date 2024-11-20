import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapApiService {
  private map!: google.maps.Map;

  initializeMap(mapElement: HTMLElement, options: google.maps.MapOptions): void {
    this.map = new google.maps.Map(mapElement, options);
  }

  // Method to update the map's center
  updateMapCenter(lat: number, lng: number): void {
    this.map.setCenter(new google.maps.LatLng(lat, lng));
  }

  // Method to update the zoom level
  updateZoomLevel(zoom: number): void {
    this.map.setZoom(zoom);
  }
}
