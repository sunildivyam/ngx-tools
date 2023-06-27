import { OpenaiPromptType } from "../enums/openai.enums";

export interface OpenaiConfig {
    apiKey: string;
    organization: string;
};

export enum OpenaiImageSize {
    _256x256 = '256x256',
    _512x512 = '512x512',
    _1024x1024 = '1024x1024'
};

export interface OpenaiPrompt {
    prompt: string;
    message?: OpenaiMessage;
    promptType?: OpenaiPromptType;
};

export interface OpenaiMessage {
    mdText?: string;
    htmlText?: string;
    jsonText?: string;
    json?: any
};
