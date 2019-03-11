import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Firebase } from '@ionic-native/firebase';
import { GlobalsProvider } from '../services/globals';
import { StorageProvider } from '../../providers/services/storage';

@Injectable()

export class FcmProvider 
{
    constructor(
      public fcm: Firebase,
      public storage: StorageProvider,
      public globals: GlobalsProvider,
      public platform: Platform,
    ){
      this.getFcmToken();
      // this.getFcmTokenOnRefresh();
    }

    private saveToken = (token) =>
    {
        if (!token) return;
        this.globals.config.fcm = token;
        console.log(token);

        // this.storage.saveItem("appConfig", this.globals.config)
        // .then((res) => {
        //     console.log("saved fcm");
        // })
        // .catch(err => {
        //     console.log("error saving fcm");
        // });
    }

    private getFcmToken = async () =>
    {
        let token;
      
        if (this.platform.is('android')) {
          token = await this.fcm.getToken()
        } 
      
        if (this.platform.is('ios')) {
          token = await this.fcm.getToken();
          await this.fcm.grantPermission();
        } 
        
        // return this.saveToken(token)
    }
  
    private getFcmTokenOnRefresh = async () =>
    {
        let token;
      
        if (this.platform.is('android')) {
          token = await this.fcm.onTokenRefresh()
        } 
      
        if (this.platform.is('ios')) {
          token = await this.fcm.onTokenRefresh();
          await this.fcm.grantPermission();
        } 
        
        return this.saveToken(token)
    }

    foregroundFCMNotification()
    {
        return this.fcm.onNotificationOpen();
    }
}