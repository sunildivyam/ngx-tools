import { OpenaiConfigurationTypeEnum } from "../enums/openai-http.enums";
import { OpenaiConfiguration, OpenaiConfigurationItem } from "../interfaces/openai-http.interface";


const chatModel = {
    type: OpenaiConfigurationTypeEnum.string,
    value: 'gpt-3.5-turbo',
} as OpenaiConfigurationItem;

const audioModel = {
    type: OpenaiConfigurationTypeEnum.string,
    value: 'whisper-1',
} as OpenaiConfigurationItem;

const n = {
    type: OpenaiConfigurationTypeEnum.number,
    value: 1,
} as OpenaiConfigurationItem;

const temperature = {
    type: OpenaiConfigurationTypeEnum.number,
    value: 1,
    min: 0,
    max: 2,
    step: 0.1,
} as OpenaiConfigurationItem;

const messages = {
    type: OpenaiConfigurationTypeEnum.Array,
    value: [],
} as OpenaiConfigurationItem;

const language = {
    type: OpenaiConfigurationTypeEnum.string,
    value: 'en',
} as OpenaiConfigurationItem;

const prompt = {
    type: OpenaiConfigurationTypeEnum.string,
    value: '',
} as OpenaiConfigurationItem;

const file = {
    type: OpenaiConfigurationTypeEnum.Object,
    value: null,
} as OpenaiConfigurationItem;

const response_format = {
    type: OpenaiConfigurationTypeEnum.string,
    value: 'json',
    rangeValues: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
} as OpenaiConfigurationItem;

const image_response_format = {
    type: OpenaiConfigurationTypeEnum.string,
    value: 'b64_json',
    rangeValues: ['b64_json', 'url']
} as OpenaiConfigurationItem;

const max_tokens = {
    type: OpenaiConfigurationTypeEnum.number,
    value: 1024,
    min: 1,
    max: 2048,
    step: 1,
} as OpenaiConfigurationItem;

const size = {
    type: OpenaiConfigurationTypeEnum.string,
    value: '1024x1024',
    rangeValues: ['1024x1024', '512x512', '256x256'],
} as OpenaiConfigurationItem

const image = {
    type: OpenaiConfigurationTypeEnum.string,
    value: '',
} as OpenaiConfigurationItem;

const mask = {
    type: OpenaiConfigurationTypeEnum.string,
    value: '',
} as OpenaiConfigurationItem;



// CONFIG
export const OPENAI_CONFIGURATION_DEFAULT: OpenaiConfiguration = {
    baseApiUrl: {
        type: OpenaiConfigurationTypeEnum.string,
        value: 'https://api.openai.com/v1/',
    } as OpenaiConfigurationItem,
    apiKey: {
        type: OpenaiConfigurationTypeEnum.string,
        value: '',
    } as OpenaiConfigurationItem,
    cleanupKeywords: {
        type: OpenaiConfigurationTypeEnum.string,
        value: 'AI model, As an AI language model',
    } as OpenaiConfigurationItem,
    headers: {
        type: OpenaiConfigurationTypeEnum.Object,
        value: {
            'OpenAI-Organization': {
                type: OpenaiConfigurationTypeEnum.string,
                value: '',
            } as OpenaiConfigurationItem
        },
    } as OpenaiConfigurationItem,
    endpoints: {
        type: OpenaiConfigurationTypeEnum.Object,
        value: {
            'models': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'data',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            response_format,
                        },
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'chat/completions': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'choices[].message.content',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            model: chatModel,
                            messages,
                            temperature,
                            n,
                            response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'completions': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'choices[].text',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            model: chatModel,
                            prompt,
                            temperature,
                            n,
                            max_tokens,
                            response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'images/generations': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'data.b64_json',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            prompt,
                            size,
                            n,
                            response_format: image_response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'images/edits': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'data.b64_json',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            image,
                            mask,
                            prompt,
                            size,
                            n,
                            response_format: image_response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'images/variations': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'data.b64_json',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            image,
                            prompt,
                            size,
                            n,
                            response_format: image_response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'audio/transcriptions': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'text',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            model: audioModel,
                            file,
                            language,
                            prompt,
                            temperature,
                            response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
            'audio/translations': {
                type: OpenaiConfigurationTypeEnum.Object,
                value: {
                    responseKey: {
                        type: OpenaiConfigurationTypeEnum.string,
                        value: 'text',
                    },
                    requestParams: {
                        type: OpenaiConfigurationTypeEnum.Object,
                        value: {
                            model: audioModel,
                            file,
                            prompt,
                            temperature,
                            response_format,
                        }
                    } as OpenaiConfigurationItem,
                },
            } as OpenaiConfigurationItem,
        },
    } as OpenaiConfigurationItem,
};

