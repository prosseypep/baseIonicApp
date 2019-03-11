import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import firebase from 'firebase/app';
// import firebase from 'firebase/auth';
import { fireEmailUser } from '../models/model';

@Injectable()

export class FirebaseAuthProvider 
{
  loading:any;
  constructor(
    public loadingCtrl: LoadingController
  ) {
  }

  public checkAuthState = (callback: (data:any) => {}) =>
  {
    firebase.auth().onAuthStateChanged(
      (user) => {
        callback(user);
      }, 
      (error) => {
        callback(error);
      }
    );
  }

  signOut = () =>
  {
    return firebase.auth().signOut();
  }

  public signIn = (type:string, form: fireEmailUser) => 
  {
    switch(type)
    {
      case "email":
      {
        return firebase.auth().signInWithEmailAndPassword(form.email, form.password);
      }
      default:
      {

      }
    }
  }

  public signUp = (type:string, form: fireEmailUser) => 
  {
    switch(type)
    {
      case "email":
      {
        return firebase.auth().createUserWithEmailAndPassword(form.email, form.password);
      }
      default:
      {

      }
    }
  }

  public updateProfile = (form) => {
    return firebase.auth().currentUser.updateProfile(form);
  }

}
