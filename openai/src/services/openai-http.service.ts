import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenaiConfiguration } from '../interfaces/openai-http.interface';
import { OpenaiConfigService } from './openai-config.service';

/**
 * TODO: inprogress
 */
@Injectable({
  providedIn: 'root'
})
export class OpenaiHttpService {
  openaiConfiguration: OpenaiConfiguration = null;

  constructor(
    private httpClient: HttpClient,
    private openaiConfigurationService: OpenaiConfigService,
  ) {

    this.openaiConfigurationService.config.subscribe(config => this.openaiConfiguration = config);
  }

  public getOpenaiEndpointResult(endpoint,): any {

  }

}
