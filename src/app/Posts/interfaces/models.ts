import {WithCursorParams, WithSearchParam} from 'common/interfaces/base'

export interface IPostShort {
    id: string
    title: string
    link: string
    image: string
    published_at?: string
    created_at: string
}

export interface IPost extends IPostShort {
    content?: string
}

// requests
export interface PostsRequest extends WithSearchParam, WithCursorParams {}

export interface PostCreateRequest {
    title: string
    content?: string
    link?: string
    image: string
    publish?: boolean
}

export interface PostUpdateRequest {
    title?: string
    content?: string
    link?: string
    image?: string
    publish?: boolean
}

// responses
export interface PostsResponse {
    posts: IPostShort[]
    total_count: number
}

export interface PostResponse {
    post: IPost
}

export interface PostCreateResponse extends PostResponse {}
