import { Injectable } from '@angular/core';

const FETCH_TIMEOUT = 10000;

@Injectable()
export class RequestService 
{
  csrf:string = null;
  jwt:string = null;
  headers:any = null;
  private url = 'http://api.authenticdoc.tk/';
  private didTimeOut = false;

  constructor() 
  { 
    this.csrf = this.randomPassword(10);
  }

  randomPassword = (length) =>
  {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return btoa(pass);
  }

  getRequest = (routes = null) => 
  {
    try
    {
    // Default options are marked with *
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
          this.didTimeOut = true;
          reject(new Error('Request timed out'));
      }, FETCH_TIMEOUT);
        fetch(this.url + routes, {
          method: 'GET',
          mode: 'cors',
          cache: 'default',
          headers: {
            "X-Token":this.csrf,
            "Authorization": "Bearer " + this.jwt
          },
          credentials: 'same-origin'
        })
        .then(response => {
          clearTimeout(timeout);
          if(!this.didTimeOut) {
            resolve(response.json());
          }
        }) // parses response to JSON
        .catch(error => {
          if(this.didTimeOut) return;
          reject(error);
        });
      })
    }
    catch(ex)
    {
      console.info(ex);
      return ex;
    }
  }

  postRequest = (routes = null, data) => 
  {
    try
    {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            this.didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
        fetch(this.url + routes, {
          method: "POST",
          headers: {
            "cache-control": "no-cache",
            "Accept-language": "en",
            "X-Token": this.csrf,
            "Authorization": "Bearer " + this.jwt
          },
          mode: "cors",
          cache: "no-cache", 
          credentials: "same-origin", 
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: data, // body data type must match "Content-Type" header
        })
        .then(response => {
          clearTimeout(timeout);
          if(!this.didTimeOut) {
            resolve(response.json());
          }
        }) // parses response to JSON
        .catch(error => {
          if(this.didTimeOut) return;
          reject(error);
        });
      })
    }
    catch(ex)
    {
      return ex;
    }
  };

  transformRequest(obj)
  {
      var $res = [];
      for(var key in obj)
      {
          $res.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return $res.join('&');
  }

  updateRequest = (routes = null, data) => 
  {
    try
    {
      data = this.transformRequest(data);
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            this.didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
          fetch(this.url + routes, {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Accept-language": "en",
            "X-Token": this.csrf,
            "Authorization": "Bearer " + this.jwt
          },
          mode: "cors",
          cache: "no-cache", 
          credentials: "same-origin", 
          body: data, // body data type must match "Content-Type" header
        })
        .then(response => {
          clearTimeout(timeout);
          if(!this.didTimeOut) {
            resolve(response.json());
          }
        }) // parses response to JSON
        .catch(error => {
          if(this.didTimeOut) return;
          reject(error);
        });
      })
    }
    catch(ex)
    {
      return ex;
    }
  }

  deleteRequest = (routes = null) => 
  {
    try
    {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            this.didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
          fetch(this.url + routes, {
        method: 'delete',
        headers: {
          "cache-control": "no-cache",
          "Accept-language": "en",
          "X-Token": this.csrf,
          "Authorization": "Bearer " + this.jwt
        },
      })
        .then(response => {
          clearTimeout(timeout);
          if(!this.didTimeOut) {
            resolve(response.json());
          }
        }) // parses response to JSON
        .catch(error => {
          if(this.didTimeOut) return;
          reject(error);
        });
      })
    }
    catch(ex)
    {
      return ex;
    }
  }
}
