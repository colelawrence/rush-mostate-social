import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vodka-source',
  template: require('./source.component.html'),
})
export class SourceComponent implements OnInit {
  @Input() source: string
  displaySource: string
  isHref: boolean = false
  ngOnInit () {
    this.isHref = /^\s*https?/.test(this.source)
    this.displaySource = this.source
    if (this.isHref) {
      this.displaySource = this.displaySource
          .replace(/^\s*https?:\/\//, '')
          .replace(/\/.+$/, '')
    }
  }
}
