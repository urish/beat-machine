import { TestBed, inject } from '@angular/core/testing';

import { PurpleEyeService } from './purple-eye.service';

describe('PurpleEyeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurpleEyeService]
    });
  });

  it('should ...', inject([PurpleEyeService], (service: PurpleEyeService) => {
    expect(service).toBeTruthy();
  }));
});
