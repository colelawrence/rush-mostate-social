import { DataSummary, DataEvent, DataSponsor } from 'mostate-rush/data-interfaces'
const data = <DataSummary> require('mostate-rush/dist/events.json')

export type DisplayEvent = DataEvent & {
  displayDescription?: string
  hrefLocation?: string
  hrefMeetLocation?: string
}

declare var twemoji: { parse: (str: string) => string }

function compareEvents (a: DataEvent, b: DataEvent): number {
  let aTime = a.startTime || a.meetTime || 0
  let bTime = b.startTime || b.meetTime || 0
  return aTime - bTime
}

import { emojiByName } from './emoji.list'
const emojiFind = new RegExp(
  Object.keys(emojiByName)
    .filter((a) => a.length > 2)
    .map((a) => a.replace(/\+/g, '\\+'))
    .map((a) => `\\b${a}\\b`)
    .join('|'),
  'gi')
const emojiReplace = (match: string) => emojiByName[match.toLowerCase()]

function addEventEmojis (a: DataEvent): DisplayEvent {
  const unicoded = a.description.replace(emojiFind, emojiReplace)
  const displayDescription = twemoji.parse(unicoded)
  let b = <DisplayEvent>
    Object.assign({ displayDescription }, a)
  return b
}

function addressToHref(address: string): string {
  if (typeof address !== 'string' || address.length === 0) return null
  // test if there are any breaks in the address, indicating that it may be outside Springfield
  // add Springfield, MO otherwise
  if (!/[;,]/.test(address)) address += ', Springfield, MO'
  return `https://www.google.com/maps/place/${address}`
}

function replaceEventLocationLinks (a: DataEvent): DisplayEvent {
  const hrefLocation = addressToHref(a.locationAddress)
  const hrefMeetLocation = addressToHref(a.meetLocationAddress)
  let b = <DisplayEvent>
    Object.assign({}, a, { hrefLocation, hrefMeetLocation })
  return b
}

function replaceEventSemicolons (a: DataEvent): DataEvent {
  const commas = a.description.replace(/;/g, ',')
  let b = <DisplayEvent>
    Object.assign({}, a, { description: commas })
  return b
}

export function getData(): DataSummary {
  let events: DataEvent[] = data.events
    .sort(compareEvents)
    .map(replaceEventLocationLinks)
    .map(replaceEventSemicolons)
    .map(addEventEmojis)

  return {
    events: events,
    sponsors: data.sponsors
  }
}
