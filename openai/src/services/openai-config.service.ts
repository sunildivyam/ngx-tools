import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OpenaiConfiguration } from '../interfaces/openai-http.interface';
import { OPENAI_CONFIGURATION_DEFAULT } from '../constants/openai-http.constants';

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
    this.config$.next({
      ...this.config$.value,
      apiKey: {
        ...this.config$.value.apiKey,
        value: apiKey
      },
      headers: {
        ...this.config$.value.headers,
        value: {
          ...this.config$.value.headers.value,
          'OpenAI-Organization': {
            ...this.config$.value.headers.value['OpenAI-Organization'],
            value: organization,
          },
        }
      }
    });
  }

  public updateConfig(config: OpenaiConfiguration) {
    this.config$.next(config);
  }
}
