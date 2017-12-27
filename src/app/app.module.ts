import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSelectModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, MatSliderModule,
  MatCheckboxModule, MatButtonModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { EngineModule } from './engine/engine.module';
import { AppComponent } from './app.component';
import { BeatIndicatorComponent } from './beat-indicator/beat-indicator.component';
import { InstrumentTileComponent } from './instrument-tile/instrument-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    BeatIndicatorComponent,
    InstrumentTileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonModule,
    EngineModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
