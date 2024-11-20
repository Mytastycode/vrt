/// <reference types="google.maps" />
declare const google: any;

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import { GoogleMapApiService } from '../services/google-map-api.service';
import { DataService } from '../services/data-service.service';
import { Observable } from 'rxjs';



interface Window {
  initMap: () => void;
}
declare const window: Window;

@Component({
  selector: 'app-google-map-api',
  standalone: true,
  imports: [],
  templateUrl: './google-map-api.html',
  styleUrl: './google-map-api.scss'
})
export class Googlemapapi implements AfterViewInit{

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: google.maps.Map;

  constructor(private googleMapApiService: GoogleMapApiService, 
              private dataService: DataService) {}

  ngAfterViewInit(): void {

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 37.7749, lng: -122.4194 }, // Default center
      zoom: 12, // Default zoom
    };

    this.googleMapApiService.initializeMap(this.mapContainer.nativeElement, mapOptions);

    // Example: Update center and zoom
    setTimeout(() => {
      this.googleMapApiService.updateMapCenter(40.7128, -74.0060); // New York City
      this.googleMapApiService.updateZoomLevel(14);
    }, 2000);
 
    this.loadGoogleMaps();
  }

  fetchAnalyticsMetadata(): Observable<any> {
    return this.dataService.getData(); // Delegating data fetching to the service
  }

  loadGoogleMaps() {
    // Load the Google Maps script if it’s not already loaded
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`; // Replace YOUR_API_KEY with your actual API key
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps script.");
      };
      window['initMap'] = () => this.initializeMap(); // Bind `initializeMap` to window
      document.head.appendChild(script);
    } else {
      this.initializeMap(); // Initialize map if script is already loaded
    }
  }

  initializeMap() {
    // Basic options for the map
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 37.7749, lng: -122.4194 },
      // center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
      ]
    };

    // Initialize the map in the HTML element with `#mapContainer`
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.addMarker(37.7749, -122.4194);
  }

  addMarker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Custom Title',
      icon: 'http://example.com/custom-icon.png', // Optional custom icon
    });

    marker.addListener('click', () => {
      console.log('Marker clicked!');
    });
  }

}
