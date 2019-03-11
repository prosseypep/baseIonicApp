import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// import { ProfilePage } from '../profile/profile';
import { GlobalsProvider } from '../../providers/services/globals';
import { IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage 
{
  constructor(
    public navCtrl: NavController, 
    private gVars: GlobalsProvider
  ) 
  {
    // this.gVars.alertCtrl.create();
    // this.sStorage.get("test")
    // .then((resp) => {
    //   console.log(resp);
    // })
    // .catch();;
  }

  

}
