export interface IFaq {
    id: string
    question: string
    answer: string
    created_at: string
}

// requests
export interface FaqCreateRequest {
    question: string
    answer: string
}

export interface FaqUpdateRequest {
    question?: string
    answer?: string
}

// responses
export interface FaqListResponse {
    faqs: IFaq[]
}

export interface FaqCreateResponse {
    faq: IFaq
}
