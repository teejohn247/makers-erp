import { TestBed } from '@angular/core/testing';

import { AceerpService } from './aceerp.service';

describe('AceerpService', () => {
  let service: AceerpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AceerpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
