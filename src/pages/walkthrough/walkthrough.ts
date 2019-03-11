import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage} from 'ionic-angular';
import { StorageProvider } from '../../providers/services/storage';
import { GlobalsProvider } from '../../providers/services/globals';
declare var $ :any;

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage 
{
  @ViewChild('mySlider') slider: Slides;
  private currentIndex:number;
  
  slides = [
    {
      title: "Find drivers going your way",
      description: "Get access to the <b>Taxi app</b> to find the best talent to help you build the next big thing.",
      color: "#232e33",
    },
    {
      title: "What is Taxi App?",
      description: "<b>Taxi App</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      color: "#FFC107",
    },
    {
      title: "Your ready? Lets Begin",
      description: "The Taxi App platform is deisgned with interconectivity in mind. Connect with anybody/corper and collaborate.",
      color: "#283593",
    }
  ];
  
  constructor(
    public navCtrl: NavController, 
    private storage: StorageProvider,
    private globals: GlobalsProvider
  ) 
  {
    this.globals.config = {
      walkthrough: false,
      login: false,
      fcm: null
    };
  }

  slideChange = () =>
  {
    this.currentIndex = this.slider.getActiveIndex();
    if(this.currentIndex >= 2)
    {
      $('.footer').removeClass('hidden');
    }
    else if(this.currentIndex < 2)
    {
      $('.footer').addClass('hidden');
    }
  }

  skipToHome = () =>
  {
    this.globals.config.walkthrough = true;
    this.storage.saveItem("appConfig", this.globals.config)
    .then((res) => {
      this.navCtrl.setRoot('WelcomePage');
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
