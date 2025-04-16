import {WithCursorParams} from 'common/interfaces/base'

import {ISupportTopicShort} from 'app/References/SupportTopics/interfaces/models'
import {VaccinationGender} from '../../Vaccinations/interfaces/models'

export enum SupportMessageAuthor {
    USER = 'user',
    SUPPORT = 'support'
}

export interface ISupport {
    id: string
    name: string
    last_message: string
    unread_messages: number
    has_answer: boolean
    created_at: string
}

export interface ISupportMessage {
    id: string
    author: SupportMessageAuthor
    is_read: boolean
    message: string
    created_at: string
    request_id?: string
}

export interface IMessageClientSnapshotUser {
    birthday: string
    gender: VaccinationGender
    diseases_risk?: string[]
    activities?: string[]
    hobbies?: string[]
    residence_region?: {name: string}
    regions?: {
        name: string
        trip_at: string
    }[]
    countries?: {
        name: string
        trip_at: string
    }[]
    vaccinations?: {
        name: string
        vaccinated_at: string
    }[]
}

// requests
export interface SupportListRequest extends WithCursorParams {}

export interface SupportMessagesRequest {
    limit?: number
    after?: string
    before?: string
}

export interface SupportMessageCreateRequest {
    message: string
    topic_id?: string
}

// responses
export interface SupportListResponse {
    support_requests: ISupport[]
    total_count: number
}

export interface SupportResponse {
    request: ISupport
    last_topic: ISupportTopicShort | null
}

export interface SupportMessagesResponse {
    messages: ISupportMessage[]
}

export interface SupportMessageCreateResponse {
    message: ISupportMessage
}

export interface SupportCheckResponse {
    status: boolean
}

export interface SupportMessageClientSnapshotResponse {
    client_snapshot?: {
        users: IMessageClientSnapshotUser[]
    }
}
