import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiFormComponent } from './openai-form.component';

describe('OpenaiFormComponent', () => {
  let component: OpenaiFormComponent;
  let fixture: ComponentFixture<OpenaiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenaiFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
