import { effect, Injectable, signal} from "@angular/core";

@Injectable({providedIn: 'root'})
export class ThemeService{

  private defaultTheme = 'light';

  themeSignal = signal<string>(this.getDefaultTheme());

constructor(){
  effect(() => {
    window.localStorage.setItem('themeSignal', JSON.stringify(this.themeSignal()))
  });
}

private getDefaultTheme(): string{

  const storedTheme = window.localStorage.getItem('themeSignal');

  return storedTheme ? JSON.parse(storedTheme) : this.defaultTheme;
}

setTheme(theme: string){
  this.themeSignal.set(theme);
}

updateTheme(){
  this.themeSignal.update(value => (value === "dark" ? "light" : "dark"))
}

}