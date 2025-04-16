export interface ISupportTopicShort {
    id: string
    name: string
}

export interface ISupportTopic extends ISupportTopicShort {
    request_count: number
}

// requests
export interface SupportTopicCreateRequest {
    name: string
}

export interface SupportTopicUpdateRequest extends SupportTopicCreateRequest {}

// responses
export interface SupportTopicsResponse {
    topics: ISupportTopic[]
}

export interface SupportTopicCreateResponse {
    topic: ISupportTopic
}