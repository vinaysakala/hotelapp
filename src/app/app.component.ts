import { Component,OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    // Wait for your app logic/data to load here
    this.initializeApp();
  }

  async initializeApp() {
    // This will hide the splash screen only when the app is actually ready
    await SplashScreen.hide();
  }
}
