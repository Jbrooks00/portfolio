import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [TerminalComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TerminalComponent],
})
export class TerminalPageModule { }
