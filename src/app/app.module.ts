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
import { InstrumentTileComponent } from './instrument-tile/instrument-tile.component';
import { RobotConnectorComponent } from './robot-connector/robot-connector.component';
import { MagicBlueService } from './magic-blue.service';
import { PurpleEyeService } from './purple-eye.service';

@NgModule({
  declarations: [
    AppComponent,
    BeatIndicatorComponent,
    InstrumentTileComponent,
    RobotConnectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    EngineModule,
  ],
  providers: [
    MagicBlueService,
    PurpleEyeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
