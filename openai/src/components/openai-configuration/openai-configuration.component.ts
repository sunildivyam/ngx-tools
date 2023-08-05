import { Component } from '@angular/core';
import { OpenaiConfigService } from '../../services/openai-config.service';
import { OpenaiConfiguration } from '../../interfaces/openai-http.interface';
import { UtilsService } from '@annuadvent/ngx-core/utils';
import { CodeBlockInfo } from '@annuadvent/ngx-common-ui/code-block';
import { OPENAI_CONFIGURATION_DEFAULT } from '../../constants/openai-http.constants';
import { AppConfigService } from '@annuadvent/ngx-core/app-config';
import { OpenaiConfig } from '../../interfaces/openai.interface';

@Component({
  selector: 'anu-openai-configuration',
  templateUrl: './openai-configuration.component.html',
  styleUrls: ['./openai-configuration.component.scss']
})
export class OpenaiConfigurationComponent {
  config: OpenaiConfiguration = null;

  showLoadFromJsonModal: boolean = false;
  fromJsonConfigStr: string = '';
  fromJsonErrorMsg: string = '';

  constructor(
    private openaiConfigService: OpenaiConfigService,
    private appConfigService: AppConfigService,
    private utilsService: UtilsService,
  ) {

    // Subscribe to openai config change
    this.openaiConfigService.config.subscribe((config: OpenaiConfiguration) => {
      this.config = this.utilsService.deepCopy(config);
    });
  }

  public updateClicked(event: any): void {
    event.preventDefault();
    this.openaiConfigService.updateConfig(this.utilsService.deepCopy(this.config));
  }

  public loadDefault(event: any): void {
    event.preventDefault();
    this.config = this.openaiConfigService.mergeKeyConfigWithBaseConfig(
      this.utilsService.deepCopy(OPENAI_CONFIGURATION_DEFAULT),
      this.appConfigService.openai as OpenaiConfig
    );
  }

  public loadFromJsonClicked(event: any): void {
    event.preventDefault();
    this.fromJsonErrorMsg = '';
    this.fromJsonConfigStr = JSON.stringify(this.config || {}, null, '\t');
    this.showLoadFromJsonModal = true;
  }

  public loadFromJsonOkClicked(event: any): void {
    this.showLoadFromJsonModal = false;

    try {
      this.config = JSON.parse(this.fromJsonConfigStr);
      this.showLoadFromJsonModal = false;
    } catch (err: any) {
      this.fromJsonErrorMsg = err.message || err.text || err.toString() || 'something is wrong with the json';
      setTimeout(() => this.showLoadFromJsonModal = true);
    }
  }

  public loadFromJsonCancelClicked(event: any): void {
    this.showLoadFromJsonModal = false;
  }

  public fromJsonConfigStrChanged(codeBlockInfo: CodeBlockInfo): void {
    this.fromJsonConfigStr = codeBlockInfo.source;
  }

  public getTypeOfKey(value: any): string {
    return (typeof value);
  }

  public getObjectKeys(value: any): Array<string> {
    if (typeof value === 'object' && value) {
      return Object.keys(value);
    }

    return [];
  }
}
