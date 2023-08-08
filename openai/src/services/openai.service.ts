import { Injectable } from '@angular/core';
import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponseChoicesInner,
  CreateImageRequestSizeEnum,
  CreateImageRequest,
  CreateImageRequestResponseFormatEnum,
  ImagesResponseDataInner,
} from 'openai';
import { OpenaiConfig, OpenaiImageSize } from '../interfaces/openai.interface';
import { OpenaiConfigService } from './openai-config.service';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  openAi: OpenAIApi | undefined;
  openaiConfig: OpenaiConfig | undefined;

  constructor(
    private openaiConfigService: OpenaiConfigService,
  ) {
    this.openaiConfigService.config.subscribe(config => {
      this.initOpenai(this.openaiConfigService.getKeyConfig(config));
    })
  }

  public initOpenai(openaiConfig: OpenaiConfig) {
    if (!openaiConfig || !openaiConfig.apiKey || !openaiConfig.organization) throw new Error('Invalid openai configuration.');

    this.openaiConfig = { ...openaiConfig };

    const { apiKey, organization } = this.openaiConfig;
    const configuration: Configuration = new Configuration({
      organization,
      apiKey,
    });

    delete configuration.baseOptions.headers['User-Agent'];
    this.openAi = null;
    this.openAi = new OpenAIApi(configuration);
  }

  public async getChatResponse(prompts: Array<string>): Promise<string> {
    if (!this.openAi) throw new Error('Openai is not initialzed. Use initOpenai(openaiConfig) to initialize');
    if (!prompts || !prompts.length) throw new Error(
      'Not a valid Prompt. Provide one or more prompts in an array of strings.'
    );

    const messages: Array<ChatCompletionRequestMessage> = prompts.map(
      (p) => ({ role: 'user', content: p } as ChatCompletionRequestMessage)
    );
    const req: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      n: 1,
    };

    const response = await this.openAi.createChatCompletion(req);
    const resultMessages: Array<CreateChatCompletionResponseChoicesInner> =
      response.data?.choices || [];
    const msgContents = resultMessages.map(
      (rmChoices: CreateChatCompletionResponseChoicesInner) =>
        rmChoices.message?.content
    );

    return msgContents.join('\n');
  }

  public async getImagetResponse(
    promptText: string,
    imagesCount: number = 1,
    imageSize: OpenaiImageSize,
  ): Promise<Array<string>> {
    if (!this.openAi) throw new Error('Openai is not initialzed. Use initOpenai(openaiConfig) to initialize');

    if (!promptText) throw new Error('Not a valid Image Prompt.');

    const req: CreateImageRequest = {
      prompt: promptText,
      n: imagesCount || 1,
      size: imageSize || CreateImageRequestSizeEnum._1024x1024,
      response_format: CreateImageRequestResponseFormatEnum.B64Json,
    };

    const response = await this.openAi.createImage(req)

    const imagesData: Array<ImagesResponseDataInner> =
      response.data?.data || [];

    const base64Images = imagesData.map((data: ImagesResponseDataInner) => data.b64_json || '');

    return base64Images;
  }
}
