import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()

export class StorageProvider 
{
    constructor(
        private storage: Storage
    ) 
    { 

    }

    saveItem = (key: string, data: {}) =>
    {
        return this.storage.set(key, data)
    }

    getItem = (key: string) =>
    {
        return this.storage.get(key);
    }

    removeItem = (key: string) =>
    {
        return this.storage.remove(key);
    }

    clear = () =>
    {
        return this.storage.clear();
    }
}