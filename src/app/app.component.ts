import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GlobalsProvider } from '../providers/services/globals';
import { StorageProvider } from '../providers/services/storage';
import { FcmProvider } from '../providers/firebase/fcm';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { tap } from 'rxjs/operators';
import { appConfig, userProfile } from '../providers/models/model';
import { pushConfig } from '../providers/config/config';
@Component({
  templateUrl: 'app.html'
})

export class MyApp 
{
  @ViewChild(Nav) nav: Nav
  rootPage:any;
  pages: Array<{title: string, component: any, ios: string, md: string}>;
  userData: userProfile;

  ionViewWillEnter()
  {}

  constructor(
    private ngzone: NgZone,
    private statusBar: StatusBar,
    private globals: GlobalsProvider,
    private storage: StorageProvider,
    private fcm: FcmProvider,
    private splashScreen: SplashScreen,
    public push: Push
  ) {
    this.globals.platform.ready()
    .then(() => {
      this.appUI();
      this.initApp();
    });
  }

  appUI()
  {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.pushNotification();
    this.globals.getUserData()
    .then((userData: userProfile) => {
        this.userData = this.globals.userData = userData;
        this.styleSidebarUserDetails();
    });
  }

  initApp()
  {
    this.storage.getItem("appConfig")
    .then((data: appConfig) => {
      this.globals.config.walkthrough = (!data) ? false : true;
      this.globals.config = (!data) ? null : data;
      this.rootPage = (!this.globals.config || this.globals.config.walkthrough == false)
                        ? 'WalkthroughPage'
                        : (this.globals.config.login) 
                          ? 'HomePage' 
                          : 'WelcomePage' ;
    });
  }

  styleSidebarUserDetails = () =>
  {
    console.log(this.userData);
    if(this.userData.photoURL != null)
    {
      document.getElementById('profileImg').setAttribute('src', this.userData.photoURL);
      document.getElementById('username').innerText = this.globals.cutString(this.userData.displayName, 20);
      document.getElementById('email').innerText = this.globals.cutString(this.userData.email, 15);
    }
  }

  pushNotification()
  {
    try{
      this.fcm.foregroundFCMNotification().pipe(
        tap(msg => {
          const toast = this.globals.toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      )
      .subscribe();
  
  
      const options: PushOptions = pushConfig;
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('registration').subscribe((data: any) => {
        // TODO - send device token to server
      });
      pushObject.on('notification').subscribe((notification: any) => {
        if (notification.additionalData.foreground) {
          this.globals.notify.schedule({
            trigger: {at: new Date(new Date().getTime() + 3600)},
            text: notification.title,
            data: notification.message
          });
        }
        else{
          this.globals.notify.schedule({
            trigger: {at: new Date(new Date().getTime() + 3600)},
            text: notification.title,
            data: notification.message
          });
            // callback(notification)
        }
      });
    
      pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
    }
    catch(ex)
    {
      const toast = this.globals.toastCtrl.create({
        message: 'Error with Push plugin' + ex,
        duration: 3000
      });
      toast.present();
    }
  }
  
  navigate = (page) =>
  {
    this.nav.setRoot(page.component);
  }
}

