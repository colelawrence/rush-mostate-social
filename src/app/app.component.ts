import { Component, OnInit } from '@angular/core'

import { DataSummary, DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'
import { getData } from './get-data'

import { EventDetailComponent } from './event-detail/event-detail.component'

const Moment = require('moment')

const data: DataSummary = getData()

interface EventDay {
  date: any,
  isToday: boolean,
  events: DataEvent[]
}

interface EventsByTime {
  [time: number]: DataEvent[]
}

export interface EventFilter {
  (event: DataEvent): boolean
}
export interface EventSorter {
  (eventA: DataEvent, eventB: DataEvent): number
}

@Component({
  selector: 'vodka',
  template: require('./app.component.html'),
  directives: [EventDetailComponent],
  styles: [
`:host {
  display: block;
}`,
require('!raw!stylus!./app.component.styl')
  ]
})
export class AppComponent implements OnInit {
  selectedEvent: DataEvent = null

  eventDays: EventDay[] = []

  sponsors: { [name: string]: DataSponsor }
  constructor() {
    this.sponsors = data.sponsors
  }

  // Filters used to filter out events
  getFilters(): EventFilter[] {
    let timeNow = Date.now()
    return [
      (e) => isEventHappening(e, timeNow)
    ]
  }

  ngOnInit () {
    this.update()
    this.selectedEvent = this.eventDays[0].events[0] || null
  }

  createDayTitle(m: any): string {
    return (<string> Moment(m).calendar(null, {
      sameDay: '--- [Today] ---',
      nextDay: '--- [Tomorrow] ---',
      lastDay: '--- [Yesterday] ---',
      nextWeek: 'dddd, MMM Do',
      sameElse: 'dddd, MMM Do'
    })).replace(/ at.*$/, '')
  }

  update() {
    let events = data.events

    for (let filter of this.getFilters()) {
      events = events.filter(filter)
    }

    let timeNow = Date.now()
    events.forEach((e) => {
      if (hasEventStarted(e, timeNow)) {
        (<any> e).started = true
      }
    })

    const eventsByTime = sortEventsByDay(events)
    const eventDays = createEventDays(eventsByTime)
    this.eventDays = eventDays
  }
}

function sortEventsByDay(events: DataEvent[]): EventsByTime {
  let eventDaysByTime: EventsByTime = {};

  // divide events by time of day
  events.forEach((event) => {
    let time = event.startTime || event.meetTime || console.warn('Invalid time')
    let timeN = <number> Moment(time).startOf('day').valueOf()
    if (!eventDaysByTime[timeN]) {
      eventDaysByTime[timeN] = []
    }
    eventDaysByTime[timeN].push(event)
  })

  return eventDaysByTime
}

function isEventHappening(event: DataEvent, timeNow: number): boolean {
  // 1000ms * 60s * 60min
  const hour = 36e5 * 4 // four hours
  // has not ended
  if (event.endTime) { if (event.endTime > timeNow) return true; else return false }
  // if event started or starts less than an hour ago, or has not finished yet
  if ((event.startTime || event.meetTime || 0) > timeNow - hour) return true
  return false
}
function hasEventStarted(event: DataEvent, timeNow: number): boolean {
  // if event started or starts less than an hour ago, or has not finished yet
  if ((event.startTime || event.meetTime || 0) < timeNow) return true
  return false
}

function createEventDays(eventsByTime: EventsByTime): EventDay[] {
    let eventDays: EventDay[] = []
    const today = Moment(new Date())
    for (let time in eventsByTime) {
      const events = eventsByTime[time]
      const date = new Date(+time)
      eventDays.push({
        date,
        isToday: Moment(date).isSame(today, 'day'),
        events: events
      })
    }

    return eventDays
}
