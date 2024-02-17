import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { IonicModule } from '@ionic/angular';
import { LandingRoutingModule } from './landing-routing.module';



@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    LandingRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageModule { }
