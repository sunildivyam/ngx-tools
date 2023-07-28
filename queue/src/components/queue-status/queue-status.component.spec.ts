import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueStatusComponent } from './queue-status.component';

describe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueueStatusComponent]
    });
    fixture = TestBed.createComponent(QueueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
