
import { DataSummary, DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'
const data = <DataSummary> require('mostate-rush/dist/events.json')

function compareEvents (a: DataEvent, b: DataEvent): number {
  let aTime = a.startTime || a.meetTime || 0
  let bTime = b.startTime || b.meetTime || 0
  return aTime - bTime
}

import { emojiList } from '../_emoji.list'
const emojiFind = new RegExp(
  emojiList
    .map((a) => a.replace(/\+/g, '\\+'))
    .map((a) => `\\b${a}\\b`)
    .join('|') + '(s?)',
  'gi')
const emojiReplace = (match: string, s: string) => `<i class="icon-${match.toLowerCase()}" style="display:inline-block;vertical-align: sub;"></i>${s || ''}`

function replaceEventEmojis (a: DataEvent): DataEvent {
  let b = <DataEvent> Object.assign({}, a)
  b.description = a.description.replace(emojiFind, emojiReplace)
  return b
}

export function getData(): DataSummary {
  let events: DataEvent[] = data.events
    .sort(compareEvents)
    .map(replaceEventEmojis)

  return {
    events: events,
    sponsors: data.sponsors
  }
}
