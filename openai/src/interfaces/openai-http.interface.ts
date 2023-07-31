import { OpenaiConfigurationTypeEnum } from "../enums/openai-http.enums";

export interface OpenaiConfigurationItem {
    type: OpenaiConfigurationTypeEnum;
    value: any;
    min?: number;
    max?: number;
    step?: number;
    rangeValues?: Array<string>;
};

export interface OpenaiConfiguration {
    baseApiUrl: OpenaiConfigurationItem;
    endpoints: OpenaiConfigurationItem;
    apiKey: OpenaiConfigurationItem;
    headers: OpenaiConfigurationItem;    // should contain other headers, like 'Openai-Organization', etc.
    [key: string]: OpenaiConfigurationItem;
};
