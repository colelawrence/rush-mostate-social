import { Component, OnInit } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

import { DataSummary, DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'
import { getData } from './get-data'

import { LocationTimeComponent } from './location-time/location-time.component'
import { SourceComponent } from './source/source.component'

const data: DataSummary = getData()

@Component({
  selector: 'vodka',
  template: require('./app.component.html'),
  directives: [LocationTimeComponent, SourceComponent],
  styles: [
`:host {
  display: block;
}`,
require('!raw!stylus!./app.component.styl')
  ]
})
export class AppComponent implements OnInit {
  data: DataSummary
  events: DataEvent[]
  eventDays: {
    date: any,
    isToday: boolean,
    events: DataEvent[]
  }[] = []
  sponsors: { [name: string]: DataSponsor }
  search: string
  moment: any
  constructor(private security: DomSanitizationService) {
    this.data = data
    this.moment = require('moment')
    this.events = []
    this.sponsors = data.sponsors
  }

  ngOnInit () {
    this.update()
  }

  twitter(a: string) {
    return a.replace(/^@/, '')
  }

  nToTime(n: number): string {
    return this.moment(new Date(n)).format('h:mma')
  }

  dayTitle(m: any): string {
    console.log(this.moment(m))
    return (<string> this.moment(m).calendar(null, {
      nextWeek: 'dddd, MMM Do',
      sameElse: 'dddd, MMM Do'
    })).replace(/ at.*$/, '')
  }

  update() {
    if (this.search && this.search.length > 0) {
      this.events = data.events.filter(
        (evt) => evt.description.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      )
    } else {
      this.events = data.events
    }

    let nNow = Date.now()
    this.events = this.events.filter((e) => (e.startTime || e.meetTime || 0) > nNow)

    let eventDaysByTime: {[time: number]: DataEvent[]} = {};

    // divide events by time of day
    this.events.forEach((event) => {
      let time = event.startTime || event.endTime || console.warn('Invalid time')
      let timeN = <number> this.moment(time).startOf('day').valueOf()
      if (!eventDaysByTime[timeN]) {
        eventDaysByTime[timeN] = []
      }
      eventDaysByTime[timeN].push(event)
    })

    this.eventDays = []
    const today = this.moment(new Date())
    for (let time in eventDaysByTime) {
      const events = eventDaysByTime[time]
      const date = new Date(+time)
      this.eventDays.push({
        date,
        isToday: this.moment(date).isSame(today, 'day'),
        events: events
      })
    }
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
