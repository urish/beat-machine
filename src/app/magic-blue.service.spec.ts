import { TestBed, inject } from '@angular/core/testing';

import { MagicBlueService } from './magic-blue.service';

describe('MagicBlueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MagicBlueService]
    });
  });

  it('should ...', inject([MagicBlueService], (service: MagicBlueService) => {
    expect(service).toBeTruthy();
  }));
});
