import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiConfigurationComponent } from './openai-configuration.component';

describe('OpenaiConfigurationComponent', () => {
  let component: OpenaiConfigurationComponent;
  let fixture: ComponentFixture<OpenaiConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenaiConfigurationComponent]
    });
    fixture = TestBed.createComponent(OpenaiConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
