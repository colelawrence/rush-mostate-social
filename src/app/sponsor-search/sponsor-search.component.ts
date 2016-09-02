import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
const moment = require('moment')

import { EventDay, EventFilter, EventSorter } from '../shared/event-interfaces.ts'
import { DataSummary, DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'

export type SelectedSponsors = {[sponsor: string]: boolean}

@Component({
  selector: 'vodka-sponsor-search',
  template: require('./sponsor-search.component.html'),
  styles: [
`:host {
  display: block;
}`,
    require('!raw!stylus!./sponsor-search.component.styl')
  ]
})
export class SponsorSearchComponent implements OnInit, OnChanges {
  @Input() sponsorsByName: {[name: string]: DataSponsor} = {}
  @Input() eventDays: EventDay[]
  @Input() selection: SelectedSponsors

  @Output() change: EventEmitter<SelectedSponsors>
  @Output() cancel: EventEmitter<any>
  @Output() close: EventEmitter<any>

  sponsors: DataSponsor[] = []
  eventsBySponsor: {[sponsorName: string]: DataEvent[]} = {}

  private selectedSponsors: SelectedSponsors = {}

  isSelected(sponsor: DataSponsor): boolean {
    return this.selectedSponsors[sponsor.name] || false
  }

  selectAll() {
    this.sponsors.forEach((s) => this.select(s, true))
    this.emitChange()
  }

  selectNone() {
    this.sponsors.forEach((s) => this.select(s, false))
    this.emitChange()
  }


  select(sponsor: DataSponsor, select: boolean) {
    (<any>sponsor).__selected = select
    this.selectedSponsors[sponsor.name] = select
  }

  toggle(sponsor: DataSponsor) {
    // naughty for performance
    this.select(sponsor, !(<any>sponsor).__selected)
    this.emitChange()
  }

  getSponsorInclusionText(sponsor: DataSponsor): string {
    let eventCount = this.eventsBySponsor[sponsor.name].length
    return '' + eventCount
  }

  constructor() {
    this.change = new EventEmitter<SelectedSponsors>()
    this.cancel = new EventEmitter<any>()
    this.close = new EventEmitter<any>()
  }

  ngOnChanges () {
    if (this.selection) {
      this.selectedSponsors = this.selection
    }
  }

  ngOnInit () {
    //
    this.sponsors = []
    let eventsBySponsor = this.eventsBySponsor
    eventsBySponsor = {}
    for (let name in this.sponsorsByName) {
      const sponsor = this.sponsorsByName[name]
      eventsBySponsor[name] = []
      this.sponsors.push(sponsor)
    }

    for (let eventDay of this.eventDays) {
      eventDay.events.forEach((e) => eventsBySponsor[e.sponsor].push(e))
    }

    this.eventsBySponsor = eventsBySponsor

    this.selectAll()
  }

  nToTime(n: number): string {
    return moment(new Date(n)).format('h:mma')
  }

  private emitChange() {
    setTimeout(() => this.change.emit(this.selectedSponsors), 1)
  }
}
