import { TestBed } from '@angular/core/testing';

import { SidenavStatusService } from './sidenav-status.service';

describe('SidenavStatusService', () => {
  let service: SidenavStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
