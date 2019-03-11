import { Component } from '@angular/core';
import { NavController, ViewController, IonicPage } from 'ionic-angular';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { fireEmailUser, userProfile } from '../../providers/models/model';
import { FirebaseAuthProvider } from '../../providers/firebase/auth';
import { GlobalsProvider } from '../../providers/services/globals';
import { StorageProvider } from '../../providers/services/storage';
import { FirebaseStorageProvider } from '../../providers/firebase/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage 
{  
  user = {} as fireEmailUser;
  loginForm: FormGroup;

  constructor(
    private navCtrl: NavController, 
    private fauth: FirebaseAuthProvider, 
    private fireStore: FirebaseStorageProvider,
    private globals: GlobalsProvider,
    private viewCtrl: ViewController,
    private storage: StorageProvider) 
  {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  login = (form = {email: null, password: null}) =>
  {
    let loader = this.globals.loading.create({
      content: "Verifing credentials ..."
    });
    loader.present();

    this.fauth.signIn("email", form)
    .then( (res) => { 
      if(res.user)
      {
        let profile: userProfile = res.user.providerData[0];
        this.storage.saveItem("userdata", profile)
        .then(res => {
          loader.dismiss();
          loader = this.globals.loading.create({
            content: "Saving credentials ..."
          });
          loader.present();
          this.globals.config.login = true;
          this.globals.config.walkthrough = true;
          this.storage.saveItem("appConfig", this.globals.config)
          .then(() => {
            loader.dismiss();
            loader = this.globals.loading.create({
              content: "Checking profile status"
            });
            loader.present();
            setTimeout(() => {
              loader.dismiss();
              if(profile.photoURL == null || profile.displayName == null){
                this.globals.userData = profile;
                this.globals.method = "UPDATE";
                this.navCtrl.push("EditProfilePage", { title: "Update Your Profile" });
              }
              else{
                this.globals.userData = profile;
                loader.dismiss();
                // loader = this.globals.loading.create({
                //   content: "Downloading profile image..."
                // });
                // loader.present();
                // this.fireStore.downloadImage(profile.photoURL)
                // .then((result: any) => {
                //   this.storage.saveItem("imageData", result)
                //     .then(() => {
                      // loader.dismiss();
                      this.viewCtrl.dismiss();
                      this.navCtrl.setRoot('HomePage');
                //     })
                //     .catch(err => {
                //       loader.dismiss();
                //       const toast = this.globals.toastCtrl.create({
                //         message: err,
                //         duration: 3000
                //       });
                //       toast.present();
                //     });
                // })
                // .catch(err => {
                //   loader.dismiss();
                //   const toast = this.globals.toastCtrl.create({
                //     message: err,
                //     duration: 3000
                //   });
                //   toast.present();
                // });
              }
            }, 3000);
          })
          .catch(err => {
            loader.dismiss();
            const toast = this.globals.toastCtrl.create({
              message: err,
              duration: 3000
            });
            toast.present();
          });
        })
        .catch(err => {
          loader.dismiss();
          const toast = this.globals.toastCtrl.create({
            message: err,
            duration: 3000
          });
          toast.present();
        });
      }
    })
    .catch( (err) => {
      loader.dismiss();
      const toast = this.globals.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  goToRegister = () =>
  {
    this.navCtrl.push('RegisterPage');
  }

  dismiss = () =>
  {
    this.viewCtrl.dismiss();
  }

}
