import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiImageFormComponent } from './openai-image-form.component';

describe('OpenaiImageFormComponent', () => {
  let component: OpenaiImageFormComponent;
  let fixture: ComponentFixture<OpenaiImageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenaiImageFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
