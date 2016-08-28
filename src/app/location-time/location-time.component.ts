import { Component, OnInit, Input } from '@angular/core';
const moment = require('moment')

@Component({
  selector: 'vodka-location-time',
  template: require('./location-time.component.html'),
  styles: [
`:host {
  display: block;
}
.at {
  color: grey;
}`]
})
export class LocationTimeComponent implements OnInit {
  @Input() location: string
  @Input() locationAddress: string
  @Input() locationHref: string
  @Input() time: number
  @Input() timeEnd: number
  ngOnInit () {
    //
  }
  nToTime(n: number): string {
    return moment(new Date(n)).format('h:mma')
  }
}
