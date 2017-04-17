import { TestBed, inject } from '@angular/core/testing';

import { BeatEngineService } from './beat-engine.service';

describe('BeatEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeatEngineService]
    });
  });

  it('should ...', inject([BeatEngineService], (service: BeatEngineService) => {
    expect(service).toBeTruthy();
  }));
});
