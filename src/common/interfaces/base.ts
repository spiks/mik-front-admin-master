export interface WithSearchParam {
    search?: string
}

export interface WithCursorParams {
    limit?: number
    cursor?: string
}

export interface WithOffsetParams {
    limit?: number
    offset?: number
}

export interface IInjectedObject {
    id: string
    name: string
    risk: boolean
}
