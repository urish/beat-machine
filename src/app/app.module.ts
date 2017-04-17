import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { AppComponent } from './app.component';
import { XMLLoaderService } from './xml-loader.service';
import { BeatEngineService } from './beat-engine.service';
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
  ],
  providers: [
    BeatEngineService,
    XMLLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
