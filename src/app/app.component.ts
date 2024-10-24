import { Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { ThemeService } from './services/theme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  title = 'vrt';

  eveList: any [] = [];

  themeService: ThemeService = inject(ThemeService);

  constructor(private http: HttpClient){
    this.getAnalyticsData();
  }

  getAnalyticsData(){
    this.http.get("https://analyticsdata.googleapis.com/v1beta/properties/G-H7V18LCFGM/metadata").subscribe((eveRes:any)=>{
      console.log();
      this.eveList = eveRes;
    })
  }
}
