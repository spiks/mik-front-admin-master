import {IVaccinationPreview} from 'app/Vaccinations/interfaces/models'

import {WithSearchParam} from 'common/interfaces/base'

export interface ICountryShort {
    id: string
    name: string
    description?: string
}

export interface ICountry extends ICountryShort {
    vaccinations: IVaccinationPreview[]
}

// requests
export interface CountriesRequest extends WithSearchParam {}

export interface CountryCreateRequest {
    name: string
    description?: string
}

export interface CountryUpdateRequest {
    name?: string
    description?: string
}

// responses
export interface CountriesResponse {
    countries: ICountryShort[]
    total_count: number
}

export interface CountryResponse {
    country: ICountry
}

export interface CountryCreateResponse {
    country: ICountryShort
}