import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { XMLLoaderService } from './xml-loader.service';
import { BeatEngineService } from './beat-engine.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    BeatEngineService,
    XMLLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
