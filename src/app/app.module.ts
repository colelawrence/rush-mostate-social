import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule }              from '@angular/forms';

import { AppComponent }  from './app.component';

// add enableProd to window so it can be called to boost performance
if (location.hostname !== "localhost") enableProdMode()

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

