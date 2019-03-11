import { Component} from '@angular/core';
import { NavController, ViewController, IonicPage } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/services/globals';
import { StorageProvider } from '../../providers/services/storage';
import { FirebaseAuthProvider } from '../../providers/firebase/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile_segment:string = "timeline";
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private globals: GlobalsProvider,
    private fireAuth: FirebaseAuthProvider,
    private storage: StorageProvider
  ) {
  }

  ionViewDidLoad() {
  }

  editProfile(type)
  {
    this.globals.method = "UPDATE";
    this.navCtrl.push("EditProfilePage", {title: type});
  }

  getProfileImageStyle() {
    return 'url(' + this.globals.userData['photoURL'] + ')'
  }

  logout()
  {
    this.fireAuth.signOut()
    .then()
    .catch(err => {
      console.log(err);
    });
    this.storage.clear()
    .then()
    .catch(err => {
      console.log(err);
    });
    this.dismiss();
    this.navCtrl.setRoot('WelcomePage');
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

}
