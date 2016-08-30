import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vodka-source',
  template: require('./source.component.html'),
})
export class SourceComponent implements OnInit {
  @Input() source: string
  displaySource: string
  href: string
  ngOnInit () {
    const isHref = /^\s*https?/.test(this.source)
    const isImage = /^\s*image:/.test(this.source)
    this.displaySource = this.source
    if (isHref) {
      this.href = this.source
      this.displaySource = 'ℹ ️️' + this.displaySource
          .replace(/^\s*https?:\/\/(www\.)?/, '')
          .replace(/(\/[^\/\d]+)([\/\d].+)?$/, '$1')
          .replace(/[^a-zA-Z]+$/, '')
    } else if (isImage) {
      const filename = this.source
          .replace(/^\s*image:/, '')
          .replace(/ /g, '-') + '.png'
      this.href = `./images/sources/${filename}`
      this.displaySource = '📷 ' + this.displaySource
          .replace(/^\s*image:/, '')
    }
  }
}
