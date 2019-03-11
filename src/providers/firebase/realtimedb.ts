import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()

export class FirebaseDBProvider
{
  private url = '';
  constructor() 
  { 
  }
  
  getFireData = async (routes = null, callback) => 
  {
    // Default options are marked with *
    firebase.database()
        .ref().child(routes)
        .on('value', 
          (data) => {
            callback(data.val())
          }
        )
  }

  saveFireData = (routes = null, data = []) => 
  {
    return firebase.database()
            .ref(this.url + routes)
            .set(data);
  };

  addFireData = (routes = null, data) => 
  {
    return firebase.database()
            .ref(this.url + routes)
            .push(data);
  }

  updateFireData = (routes = null, data) => 
  {
    return firebase.database()
            .ref(this.url + routes)
            .update(data);
  }

  deleteRequest = (routes = null) => 
  {
    return firebase.database()
            .ref()
            .remove(routes);
  }
}
