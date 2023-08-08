import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OpenaiConfiguration } from '../interfaces/openai-http.interface';
import { OPENAI_CONFIGURATION_DEFAULT } from '../constants/openai-http.constants';
import { OpenaiConfig } from '../interfaces/openai.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenaiConfigService {
  private config$ = new BehaviorSubject<OpenaiConfiguration>(OPENAI_CONFIGURATION_DEFAULT);

  constructor() { }


  public get config(): Observable<OpenaiConfiguration> {
    return this.config$.asObservable();
  }


  public get configValue(): OpenaiConfiguration {
    return this.config$.value;
  }

  public initOpenai(apiKey: string, organization: string) {
    this.config$.next(this.mergeKeyConfigWithBaseConfig(this.config$.value, { apiKey, organization }));
  }

  public mergeKeyConfigWithBaseConfig(baseConfig: OpenaiConfiguration, keyConfig: OpenaiConfig): OpenaiConfiguration {
    const { apiKey, organization } = keyConfig;

    return {
      ...baseConfig,
      apiKey: {
        ...baseConfig.apiKey,
        value: apiKey
      },
      headers: {
        ...baseConfig.headers,
        value: {
          ...baseConfig.headers.value,
          'OpenAI-Organization': {
            ...baseConfig.headers.value['OpenAI-Organization'],
            value: organization,
          },
        }
      }
    }
  }

  public getKeyConfig(config: OpenaiConfiguration): OpenaiConfig {
    const openaiConfig: OpenaiConfig = {
      apiKey: config?.apiKey?.value,
      organization: config?.headers?.value['OpenAI-Organization'].value,
    };

    return openaiConfig;
  }

  public updateConfig(config: OpenaiConfiguration) {
    this.config$.next(config);
  }
}
