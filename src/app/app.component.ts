import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { ThemeService } from './services/theme.service';
import { AnalyticsService } from './services/analytics.service';
import { HttpClient} from '@angular/common/http';
import { Googlemapapi } from "./googlemapapi/google-map-api";
import { DataService } from './services/data-service.service';

declare var google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, CommonModule, Googlemapapi],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  title = 'vrt';
  public currentVisitor: any;
  public monthlyVisits: number = 0;
  public avgVisitDuration: string = '0:00';
  public metadata: any;
  public selectedRange: string = 'day';

  // Use Angular's dependency injection to get the HttpClient
  private http = inject(HttpClient);

//themeservice
  themeService: ThemeService = inject(ThemeService); 

  constructor(private analyticsService: AnalyticsService,
              private dataService: DataService,
  ){}

  ngOnInit(): void {
    this.fetchLocalMetadata();
    this.fetchGoogleAnalyticsMetadata();
    this.googleCharts();
  }

//Fetch metadata through the DataService
fetchLocalMetadata() {
  this.analyticsService.fetchLocalMetadata().subscribe({
    next: (data) => {
      console.log('Local Metadata:', data);
      this.metadata = data;
    },
    error: (error) => {
      console.error('Error fetching local metadata:', error);
    },
  });
}

// Fetch metadata from the Google Analytics API
fetchGoogleAnalyticsMetadata() {
  this.analyticsService.fetchGoogleAnalyticsMetadata().subscribe({
    next: (data) => {
      console.log('Google Analytics Metadata:', data);
      // Do something with the data
    },
    error: (error) => {
      console.error('Error fetching Google Analytics metadata:', error);
    },
  });
}

//Google Charts
onTimeRangeChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedRange = target.value;
  this.drawChart(this.selectedRange);
}

googleCharts(){
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => this.drawChart(this.selectedRange));
}

drawChart(range: string): void {
  const data = this.getChartData(range);

  const options = {
    title: 'Event Chart',
    hAxis: { title: 'Event' },
    vAxis: { title: 'Count' },
  };

  const chart = new google.visualization.ColumnChart(
    document.getElementById('eventChart')
  );
  chart.draw(data, options);
}

getChartData(range: string): any {
  // Define sample data for different ranges
  let chartData;

  switch (range) {
    case 'day':
      chartData = [
        ['Event', 'Count'],
        ['Page View', 150],
        ['First Visit', 75],
      ];
      break;
    case 'week':
      chartData = [
        ['Event', 'Count'],
        ['Page View', 1000],
        ['First Visit', 500],
      ];
      break;
    case 'month':
      chartData = [
        ['Event', 'Count'],
        ['Page View', 4000],
        ['First Visit', 2000],
      ];
      break;
    default:
      chartData = [
        ['Event', 'Count'],
        ['Page View', 150],
        ['First Visit', 75],
      ];
  }

  return google.visualization.arrayToDataTable(chartData);
}

}
