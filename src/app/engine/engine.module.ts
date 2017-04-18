import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioBackendService } from './audio-backend.service';
import { BeatEngineService } from './beat-engine.service';
import { XMLLoaderService } from './xml-loader.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
  ],
  declarations: [],
  providers: [
    AudioBackendService,
    BeatEngineService,
    XMLLoaderService,
  ]
})
export class EngineModule { }
