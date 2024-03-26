import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsCounterComponent } from './versions-counter.component';

describe('VersionsCounterComponent', () => {
  let component: VersionsCounterComponent;
  let fixture: ComponentFixture<VersionsCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionsCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
