import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { OpenaiPrompt } from '../../interfaces/openai.interface';
import { OpenaiPromptTypeEnum } from '../../enums/openai.enums';

@Component({
  selector: 'anu-openai-form',
  templateUrl: './openai-form.component.html',
  styleUrls: ['./openai-form.component.scss'],
})
export class OpenaiFormComponent implements OnInit, OnChanges {
  @Input() prompts: Array<OpenaiPrompt> = [];
  @Input() selectedPromptText: string = '';
  @Input() showHistory: boolean = true;
  @Input() showPrompts: boolean = true;

  @Output() goClicked = new EventEmitter<Array<OpenaiPrompt>>();

  currentPrompt: string = '';

  selectedPrompt: OpenaiPrompt | undefined;
  selectedResultType: string = 'mdText';
  promptTypes = Object.entries(OpenaiPromptTypeEnum).map((pt) => ({
    key: pt[0],
    value: pt[1],
  }));
  selectedPromptType: OpenaiPromptTypeEnum = OpenaiPromptTypeEnum.content;

  constructor() { }

  ngOnInit(): void {
    this.setSelectedPrompt();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSelectedPrompt();
  }

  public setSelectedPrompt(): void {
    this.selectedPrompt = this.findPrompt(this.selectedPromptText);
    this.selectedPromptType = this.selectedPrompt?.promptType || OpenaiPromptTypeEnum.content;
  }

  public promptListChanged(): void {
    this.setSelectedPrompt();
  }

  public goBtnClick(event: any): void {
    event.preventDefault();
    if (!this.currentPrompt.trim()) return;

    if (!this.findPrompt(this.currentPrompt)) {
      this.prompts.push({
        prompt: this.currentPrompt,
        promptType: this.selectedPromptType,
        message: { mdText: '', htmlText: '', jsonText: '' },
      } as OpenaiPrompt);

      this.selectedPromptText = this.currentPrompt;
      this.selectedPrompt = this.findPrompt(this.selectedPromptText);

      this.currentPrompt = '';
      this.selectedPromptType = OpenaiPromptTypeEnum.content;

      this.goClicked.emit(this.prompts);
    }
  }

  private findPrompt(promptStr: string): OpenaiPrompt | undefined {
    return this.prompts.find((p) => p.prompt === promptStr);
  }
}
