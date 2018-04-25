import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AudioBackendService } from './audio-backend.service';
import { BeatEngineService } from './beat-engine.service';
import { XMLLoaderService } from './xml-loader.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AudioBackendService,
    BeatEngineService,
    XMLLoaderService,
  ]
})
export class EngineModule { }
