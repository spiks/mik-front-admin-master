import {WithOffsetParams, WithSearchParam} from 'common/interfaces/base'

export interface IDiseaseShort {
    id: string
    name: string
    description: string
    risk: boolean
}

export interface IDisease extends IDiseaseShort {}

// requests
export interface DiseasesRequest extends WithSearchParam, WithOffsetParams {}

export interface DiseaseCreateRequest {
    name: string
    description: string
    risk: boolean
}

export interface DiseaseUpdateRequest {
    name?: string
    description?: string
    risk?: boolean
}

// responses
export interface DiseasesResponse {
    diseases: IDiseaseShort[]
    total_count: number
}

export interface DiseaseResponse {
    disease: IDisease
}
