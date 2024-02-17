import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes),],
  
  exports: [RouterModule,]
})
export class LandingRoutingModule { }
