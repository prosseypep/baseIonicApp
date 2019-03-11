import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-content',
  templateUrl: 'nocontent.html'
})
export class NocontentComponent 
{
  _name: string = '<no name set>';

  @Input()
  set name(name: string) {
    // Here you can do what you want with the variable
    this._name = (name && name.trim()) || '<no name set>';
  }

  get name() { return this._name; }
  
  constructor() {
  }

}
