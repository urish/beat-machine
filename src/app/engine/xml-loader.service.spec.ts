import { TestBed, inject } from '@angular/core/testing';

import { XMLLoaderService } from './xml-loader.service';

describe('XmlLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XMLLoaderService]
    });
  });

  it('should ...', inject([XMLLoaderService], (service: XMLLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
