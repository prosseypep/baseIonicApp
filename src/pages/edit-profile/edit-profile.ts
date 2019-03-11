import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { NavController, NavParams, ViewController, IonicPage, ActionSheetController, Platform } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/services/globals';
import { userProfile } from '../../providers/models/model';
import { StorageProvider } from '../../providers/services/storage';
import { FirebaseStorageProvider } from '../../providers/firebase/storage';
import { FirebaseAuthProvider } from '../../providers/firebase/auth';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  @ViewChild('fileInput') fileInput;
  title: string;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  editProfileForm: FormGroup;
  formData: Object;

  constructor(
    public navCtrl: NavController, 
    public navparams: NavParams,
    public viewCtrl: ViewController, 
    private formBuilder: FormBuilder, 
    public camera: Camera,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private globals: GlobalsProvider,
    private storage: StorageProvider,
    private fireAuth: FirebaseAuthProvider,
    private fireFile: FirebaseStorageProvider
  ) {
    this.form = this.formBuilder.group({
      profilePic: [''],
    });
    this.editProfileForm = new FormGroup({
      email: new FormControl(this.globals.userData.email, [Validators.required, Validators.pattern(".+\@.+\...+")]),
      mobile: new FormControl(this.globals.userData.phoneNumber, [Validators.required, Validators.minLength(4)]),
      username: new FormControl(this.globals.userData.displayName, [Validators.required, Validators.minLength(4)]),
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.formData = this.globals.userData;
  }

  ionViewDidLoad() {
    this.title = (this.navparams.get('title')) ? this.navparams.get('title') : "Edit Profile Info" ;
  }

  editProfile(form)
  {
    if(this.globals.userData.photoURL != null && this.form.controls['profilePic'].value != '' && (this.globals.method == "UPDATE" || this.globals.method == "POST"))
    {
      // upload image
      this.uploadImage(
        (this.form.controls['profilePic'].value == '' || this.form.controls['profilePic'].value == undefined)
        ? this.globals.userData.photoURL
        : this.form.controls['profilePic'].value)
      .then((res) => {
        this.userDetailsProcessing(form);
      })
      .catch((err) => {
        this.globals.toastCtrl.create({
          message: err,
          duration: 6000
        }).present();
      });
    }
    else if(this.globals.method == "UPDATE" && this.form.controls['profilePic'].value == ''){
      this.storage.getItem("imageData")
      .then((res) => {
        if(res != null && res != undefined)
        {
          this.form = new FormGroup({
            profilePic: new FormControl(this.globals.userData.photoURL),
          });
          this.editProfile(form);
        }
      })
      .catch((err) => { console.log(err) });
    }
    else{
      this.globals.toastCtrl.create({
        message: "Please upload a profile image",
        duration: 5000
      }).present();
    }
  }

  userDetailsProcessing(form)
  {
    this.globals.userData = {
      photoURL: this.globals.userData['photoURL'],
      displayName: form.username,
      email: form.email,
      phoneNumber: form.mobile,
      providerId: 'email',
      uid: this.globals.userData.uid
    } as userProfile;
    // save user profile details
    this.processProfile(this.globals.userData)
    .then(() => {
      this.globals.config.login = true;
      this.storage.saveItem("appConfig", this.globals.config)
      .then(() => {
        this.navCtrl.setRoot(
          (this.globals.method == "POST")
          ? 'HomePage'
          : 'ProfilePage'
        );
      })
      .catch(err => {
        this.globals.toastCtrl.create({
          message: err,
          duration: 6000
        }).present();
      });
    })
    .catch(err => {
      this.globals.toastCtrl.create({
        message: err,
        duration: 6000
      }).present();
    });
  }

  uploadImage = async (image: any) =>
  {
    return await new Promise((resolve, reject) =>
    {
      this.storage.saveItem("imageData", image)
      .then(() => {
        /** this function is for getting the data of the image and uploading to the server */
        fetch(image)
        .then(res => res.blob())
        .then(blob => {
          // upload image to server
          this.fireFile.saveFiles(
            "profile/" + this.globals.userData.displayName + "." +blob.type.split('/')[1], 
            blob, (res) => {
              this.globals.userData['photoURL'] = res;
              resolve("file uploaded");
          })
        })
        .catch(err => { reject(err) });
      })
      .catch(err => { reject(err); });
    })
  }

  processProfile = async (profile: userProfile) =>
  {
    return await new Promise((resolve, reject) => {
      this.storage.saveItem("userdata", profile)
      .then((res) => {
        this.fireAuth.updateProfile(profile).then(() => {
          resolve("Profile saved");
        }).catch((err) => {
          reject(err);
        });
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  getPicture() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.captureImage(true);
          }
        },
      ]
    });
    actionSheet.present();
  }

  captureImage(useAlbum: boolean) {
    if(Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96,
        quality: 100,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    let url = (!this.form.controls['profilePic'].value) 
                ? this.globals.userData['photoURL'] 
                : this.form.controls['profilePic'].value;
    this.globals.userData.photoURL = (this.globals.userData['photoURL'] == null) 
    ? this.form.controls['profilePic'].value
    : this.globals.userData['photoURL'] ;
    return 'url(' + url + ')'
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }
}
