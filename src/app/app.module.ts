import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideFirebaseApp(() => initializeApp({
    projectId: "restaurantdemo-cd179",
    appId: "1:104342150880:web:510818929d00d47c00fa85",
    storageBucket: "restaurantdemo-cd179.firebasestorage.app",
    apiKey: "AIzaSyCGXJzzfy5pMg-UsKzGnIpHhT5t_JBl7oA",
    authDomain: "restaurantdemo-cd179.firebaseapp.com",
    messagingSenderId: "104342150880",
    measurementId: "G-MMG8S0LPV8"
  })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule { }
