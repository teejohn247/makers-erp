import { TestBed } from '@angular/core/testing';

import { HumanResourcesService } from './human-resources.service';

describe('HumanResourcesService', () => {
  let service: HumanResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
