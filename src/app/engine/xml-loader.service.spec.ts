import { TestBed, inject } from '@angular/core/testing';

import { XmlLoaderService } from './xml-loader.service';

describe('XmlLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmlLoaderService]
    });
  });

  it('should ...', inject([XmlLoaderService], (service: XmlLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
