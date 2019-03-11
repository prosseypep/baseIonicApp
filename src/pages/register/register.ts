import { Component } from '@angular/core';
import { NavController, ViewController, IonicPage } from 'ionic-angular';
import { FormControl, FormGroup, Validators} from '@angular/forms';
// import { fireEmailUser, userProfile } from '../../providers/models/model';
import { FirebaseAuthProvider } from '../../providers/firebase/auth';
import { GlobalsProvider } from '../../providers/services/globals';
import { StorageProvider } from '../../providers/services/storage';
import { fireEmailUser } from '../../providers/models/model';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage 
{
  registerForm: FormGroup;
  passwordMatch: boolean;

  constructor(
    private navCtrl: NavController, 
    private fauth: FirebaseAuthProvider, 
    private globals: GlobalsProvider,
    private viewCtrl: ViewController,
    private storage: StorageProvider
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\...+")]),
      password: new FormControl('', Validators.required),
      rpassword: new FormControl('', Validators.required),
    });
  }

  register = (form: {email: string, password: string}) =>
  {
    this.globals.userData.email = form.email;
    this.storage.saveItem("userdata", this.globals.userData)
    .then(() => {
      this.fauth.signUp("email", form)
      .then((res) => {
        this.globals.userData.uid = res.user.uid;
        this.globals.method = "POST";
        this.navCtrl.push('EditProfilePage', {title: "Add your information"});
        this.dismiss();
      })
      .catch(err => {
        this.globals.toastCtrl.create({
          message: err,
          duration: 5000,
          position: 'left'
        }).present();
      });
    })
    .catch(err => {
      this.globals.toastCtrl.create({
        message: err,
        duration: 5000,
        position: 'left'
      }).present();

    });
  }

  checkPassword()
  {
    this.passwordMatch = (this.registerForm.controls.password.value == this.registerForm.controls.rpassword.value)
      ? true
      : false ;
  }

  dismiss = () =>
  {
    this.viewCtrl.dismiss();
  }

}
