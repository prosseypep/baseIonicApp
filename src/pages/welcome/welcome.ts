import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/services/globals';
import { StorageProvider } from '../../providers/services/storage';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage 
{
  constructor(
    public navCtrl: NavController, 
    private storage: StorageProvider,
    private globals: GlobalsProvider
  ) 
  {
  }
  
  openLoginPage() 
  {
    this.navCtrl.push('LoginPage');
  }

  gotoHome()
  {
    this.globals.config.login = true;
    this.storage.saveItem("appConfig", this.globals.config)
    .then((res) => {
      this.navCtrl.setRoot('HomePage');
    })
    .catch((err) => {
      console.log(err);
    });
  }

}