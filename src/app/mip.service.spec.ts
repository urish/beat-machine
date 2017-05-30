import { TestBed, inject } from '@angular/core/testing';

import { MipService } from './mip.service';

describe('MipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MipService]
    });
  });

  it('should ...', inject([MipService], (service: MipService) => {
    expect(service).toBeTruthy();
  }));
});
