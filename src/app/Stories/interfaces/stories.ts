import {WithCursorParams, WithSearchParam} from 'common/interfaces/base'

import {FrameCreateUpdateRequest, IFrame} from './frames'

export interface IStoryShort {
    id: string
    image: string
    title: string
    activated_at?: string
    created_at: string
}

export interface IStory extends IStoryShort {
    frames: IFrame[]
}

// requests
export interface StoriesRequest extends WithSearchParam, WithCursorParams {}

export interface StoryCreateUpdateRequest {
    image: string
    title: string
    frames: FrameCreateUpdateRequest[]
}

// responses
export interface StoriesResponse {
    stories: IStoryShort[]
    total_count: number
}

export interface StoryResponse {
    story: IStory
}

export interface StoryCreateResponse {
    story: IStoryShort
}
