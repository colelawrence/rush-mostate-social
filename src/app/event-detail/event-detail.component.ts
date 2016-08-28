import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizationService } from '@angular/platform-browser'

import { LocationTimeComponent } from '../location-time/location-time.component'
import { SourceComponent } from '../source/source.component'
import { DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'

@Component({
  selector: 'vodka-event-detail',
  template: require('./event-detail.component.html'),
  styles: [
    require('!raw!stylus!./event-detail.component.styl')
  ],
  directives: [LocationTimeComponent, SourceComponent]
})
export class EventDetailComponent implements OnInit {
  @Input() event: DataEvent
  @Input() sponsor: DataSponsor
  @Input() isOpen: boolean = true
  displayTime: string
  moment: any
  constructor (private security: DomSanitizationService) {
    this.moment = require('moment')
  }
  ngOnInit () {
    const time = this.event.startTime || this.event.meetTime
    this.displayTime = this.moment(time).format('h:mma').replace(/:00/, ' ')
  }
}
