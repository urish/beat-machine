import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { EngineModule } from './engine/engine.module';
import { AppComponent } from './app.component';
import { BeatIndicatorComponent } from './beat-indicator/beat-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    BeatIndicatorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    EngineModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
