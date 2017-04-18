import { TestBed, inject } from '@angular/core/testing';

import { AudioBackendService } from './audio-backend.service';

describe('AudioBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioBackendService]
    });
  });

  it('should ...', inject([AudioBackendService], (service: AudioBackendService) => {
    expect(service).toBeTruthy();
  }));
});
