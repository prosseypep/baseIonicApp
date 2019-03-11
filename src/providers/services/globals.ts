import { Injectable, ViewChild } from '@angular/core';
import { AlertController, 
  ModalController, 
  ToastController, 
  ViewController, 
  Platform, 
  LoadingController
} from 'ionic-angular';
import { StorageProvider } from '../../providers/services/storage';
import { userProfile, appConfig } from '../models/model';
import { LocalNotifications } from '@ionic-native/local-notifications';

declare var $ :any;

@Injectable()
export class GlobalsProvider 
{
  @ViewChild('myNav') view: ViewController
  config: appConfig = {
    walkthrough: false,
    login: false,
    fcm: null
  };
  userData: userProfile;
  profilePic: boolean = false;
  search:any;
  method: string = "POST";

  constructor(
    public platform: Platform, 
    public loading: LoadingController,
    public alertCtrl: AlertController, 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private storage: StorageProvider,
    public notify: LocalNotifications 
  ){
  }

  getUserData = async () =>
  {
    return await new Promise((resolve, reject) => {
      this.storage.getItem("userdata")
      .then((user: userProfile) => { 
        this.config.login = (user == null) ? false : true;
          this.userData = (user == null) 
                  ? {
                      displayName: "John Doe",
                      email: "exmaple@example.com",
                      photoURL: null,
                      providerId: null,
                      phoneNumber: null,
                      uid: null
                    } 
                  : user;
        this.storage.getItem("imageData")
        .then((res) => {
          if(res != null && res != undefined)
          {
            this.userData.photoURL = res;
            resolve(this.userData);
          }
          else{
            resolve(this.userData);
          }
        })
        .catch((err) => { console.log(err) });
        })
      .catch((err) => { console.log(err) });
    });
  }
  
  // extra libarries functionality

  objectToArray = (obj = {}) =>
  {
    var array = [], tempObject;
    for (var key in obj) 
    {
        tempObject = obj[key];
        if (typeof obj[key] == "object") {
            tempObject = this.objectToArray(obj[key]);
        }
        array[key] = tempObject;
    }
    return array;
  }

  cutString(text:string, len:number)
  {    
      text = $($.parseHTML(text)).text();
      var i = 0;
      var wordsToCut = len;
      var wordsArray = text.split("");
      if(wordsArray.length>wordsToCut){
          var strShort = "";
          for(i = 0; i < wordsToCut; i++){
              strShort += wordsArray[i] + "";
          }   
          return strShort+"...";
      }else{
          return text;
      }
  }

  arrayToObject = (arr = []) =>
  {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        rv[i] = arr[i];
      return rv;
  }

  submitForm = (id = null) =>
  {
    $(id).click();
  }

  connectSearch = () =>
  {
    console.log(this.search);
  }

  gotoSearchPage = () =>
  {
    $('ion-navbar').removeClass('hidden');
    $('#menu').addClass('hidden');
    setTimeout(function () {
        $('.searchbar-input').focus();
    }, 100);
  }

  searchInfo = async () =>
  {
    // const modal = await this.modalCtrl.create(SearchPage);
    // modal.present();
  }

  cancelSearch = () =>
  {
    $('ion-navbar').addClass('hidden');
    $('#menu').removeClass('hidden');
  }

  gotoProfilePage = () =>
  {
    const modal = this.modalCtrl.create('ProfilePage');
    modal.present();
  }

}
