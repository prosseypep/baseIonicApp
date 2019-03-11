import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule} from '@angular/forms';

import { firebaseConfig } from '../providers/config/config';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { Push } from '@ionic-native/push';

import * as firebase from 'firebase';
firebase.initializeApp(firebaseConfig);

import { MyApp } from './app.component';
// custom providers
import { StorageProvider } from '../providers/services/storage';
import { RequestService } from '../providers/services/request';
import { NetworkProvider } from '../providers/services/network';
import { GlobalsProvider } from '../providers/services/globals';
// firebase providers
import { FirebaseDBProvider } from '../providers/firebase/realtimedb';
import { FirebaseAuthProvider } from '../providers/firebase/auth';
import { FcmProvider } from '../providers/firebase/fcm';
import { FirebaseStorageProvider } from '../providers/firebase/storage';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__baseappdb',
         driverOrder: ['indexeddb', 'websql', 'sqllite']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,SplashScreen, LocalNotifications, Camera, Firebase, Push,  /// ionic native
    StorageProvider, GlobalsProvider, RequestService, NetworkProvider,  /// CUSTOM providers
    FirebaseAuthProvider, FirebaseDBProvider, FcmProvider, FirebaseStorageProvider,  /// firebase providers
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}