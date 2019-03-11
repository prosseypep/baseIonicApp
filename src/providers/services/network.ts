import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class NetworkProvider 
{
    status:string = "Disconnected";
    constructor(
        public toast: ToastController
    )
    {
    }

    checkNetwork = () :void =>
    {
        if(navigator.onLine) 
        {
            // Update the online status icon based on connectivity
            window.addEventListener('online',  this.checkStatus);
            window.addEventListener('offline', this.checkStatus);
            this.checkStatus();
        }
    }

    private checkStatus = () =>
    {
        this.status = (navigator.onLine) ? 'Connected' : "Disconnected";
        let toast = this.toast.create({
          message: "Network is " + this.status,
          duration: 3000
        });
        toast.present();
    }
}