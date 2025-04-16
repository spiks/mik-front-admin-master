import {WithSearchParam} from 'common/interfaces/base'

import {IVaccinationPreview} from 'app/Vaccinations/interfaces/models'

export interface IRegionShort {
    id: string
    name: string
    description?: string
}

export interface IRegion extends IRegionShort {
    vaccinations: IVaccinationPreview[]
}

// requests
export interface RegionsRequest extends WithSearchParam {}

export interface RegionCreateRequest {
    name: string
    description?: string
}

export interface RegionUpdateRequest {
    name?: string
    description?: string
}

// responses
export interface RegionsResponse {
    regions: IRegionShort[]
    total_count: number
}

export interface RegionResponse {
    region: IRegion
}

export interface RegionCreateResponse {
    region: IRegionShort
}
