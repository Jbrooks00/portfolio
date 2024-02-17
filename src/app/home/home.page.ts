import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('fadeInOut', [
      state ('void', style({  opacity: 0 })),
      state ('*', style({  opacity: 1 })),
      transition('void => *', animate('1000ms ease-in')),
      transition('* => void', animate('1000ms ease-out'))
    ])
  ]
})
export class HomePage implements OnInit {
  loading = true;

  constructor() {}
  
  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }


}
