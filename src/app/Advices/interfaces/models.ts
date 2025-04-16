import {WithSearchParam} from 'common/interfaces/base'

export interface IAdvice {
    id: string
    text: string
}

// requests
export interface AdvicesRequest extends WithSearchParam {}

export interface AdviceCreateRequest {
    text: string
}

export interface AdviceUpdateRequest extends AdviceCreateRequest {}

// responses
export interface AdvicesResponse {
    advices: IAdvice[]
}

export interface AdviceResponse {
    advice: IAdvice
}

export interface AdviceCreateResponse {
    advice: IAdvice
}
