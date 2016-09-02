
import { DataEvent } from 'mostate-rush/data-interfaces'

export interface EventFilter {
  (event: DataEvent): boolean
}

export interface EventSorter {
  (eventA: DataEvent, eventB: DataEvent): number
}

export interface EventDay {
  date: any,
  isToday: boolean,
  events: DataEvent[]
}
