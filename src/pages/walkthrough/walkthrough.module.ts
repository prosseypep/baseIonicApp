import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalkthroughPage } from './walkthrough';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalkthroughPage,
  ],
  imports: [
    IonicPageModule.forChild(WalkthroughPage),
    ComponentsModule
  ],
})
export class WalkthroughPageModule { }