import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NocontentComponent } from './nocontent/nocontent';
import { ErrorComponent } from './error/error';
// import { GmapComponent } from './gmap/gmap';
@NgModule({
	declarations: [
		NocontentComponent, ErrorComponent
	],
	imports: [
		IonicModule
	],
	exports: [
		NocontentComponent, ErrorComponent
	]
})
export class ComponentsModule {}
