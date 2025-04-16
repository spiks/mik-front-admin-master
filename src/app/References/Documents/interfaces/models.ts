export interface IDocument {
    id: string
    name: string
    url: string
    created_at: string
}

// requests
export interface DocumentCreateRequest {
    name: string
    url: string
}

export interface DocumentUpdateRequest {
    name?: string
    url?: string
}

// responses
export interface DocumentsResponse {
    documents: IDocument[]
}

export interface DocumentCreateResponse {
    document: IDocument
}

export interface DocumentResponse {
    document: IDocument
}