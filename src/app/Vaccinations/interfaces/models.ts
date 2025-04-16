import {IInjectedObject, WithOffsetParams, WithSearchParam} from 'common/interfaces/base'

import {IActivity} from 'app/References/Activities/interfaces/models'
import {IHobby} from 'app/References/Hobbies/interfaces/models'
import {IRegionShort} from 'app/References/Regions/interfaces/models'
import {ICountryShort} from 'app/References/Countries/interfaces/models'

export enum VaccinationGroup {
    NK = 'nk',
    KEP = 'kep',
    TS = 'ts',
    OTHER = 'other'
}

export enum VaccinationKind {
    FIRST = 'first',
    SUBSEQUENT = 'subsequent',
    LAST = 'last',
    ONCE = 'once'
}

export enum VaccinationDurationUnit {
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
    MONTHS = 'months',
    YEARS = 'years'
}

export enum VaccinationGender {
    MALE = 'male',
    FEMALE = 'female'
}

export interface IVaccinationDuration {
    unit: VaccinationDurationUnit
    count: number
}

export interface IVaccinationPreview {
    id: string
    name: string
    name_display: string
}

export interface IVaccinationShort extends IVaccinationPreview {
    name_display: string
    group: VaccinationGroup
    kind: VaccinationKind
    duration: IVaccinationDuration
    diseases_risk: boolean
    enabled: boolean
}

export interface IVaccinationPreviousList extends IVaccinationPreview {
    name_display: string
    name_display_next: string
}

export interface IVaccinationList extends IVaccinationShort {
    order: number
}

export interface IVaccination extends IVaccinationList {
    active_from: string
    active_to: string
    previous?: IVaccinationPreview
    description?: string
    diseases: IInjectedObject[]
    injection_place: string
    next_vaccination_available_after?: IVaccinationDuration
    revaccination?: IVaccinationDuration
    recommended_age_from?: IVaccinationDuration
    recommended_age_to?: IVaccinationDuration
    gender?: VaccinationGender
    activities?: IActivity[]
    hobbies?: IHobby[]
    regions?: IRegionShort[]
    regions_from?: string
    regions_to?: string
    countries?: ICountryShort[]
    countries_injection_budget?: IVaccinationDuration
    created_at: string
    interesting_fact: string
}

// requests
export interface VaccinationsRequest extends WithSearchParam, WithOffsetParams {
    groups?: VaccinationGroup[]
}

export interface PreviousVaccinationsRequest {
    limit?: number // 5
    search?: string
    group?: VaccinationGroup
}

export interface VaccinationCreateUpdateRequest {
    name: string
    name_display: string | null
    description?: string
    diseases: string[]
    diseases_risk?: boolean
    injection_place: string
    duration: IVaccinationDuration
    next_vaccination_available_after?: IVaccinationDuration | null
    revaccination?: IVaccinationDuration | null
    recommended_age_from?: IVaccinationDuration | null
    recommended_age_to?: IVaccinationDuration | null
    gender?: VaccinationGender
    activities?: string[]
    hobbies?: string[]
    regions?: string[]
    regions_from?: string
    regions_to?: string
    countries?: string[]
    countries_injection_budget?: IVaccinationDuration
    enabled?: boolean
    interesting_fact: string
    kind: VaccinationKind
    group: VaccinationGroup | null
    previous_id?: string
}

// responses
export interface VaccinationsResponse {
    vaccinations: IVaccinationList[]
    total_count: number
}

export interface VaccinationResponse {
    vaccination: IVaccination
}

export interface VaccinationCreateResponse {
    vaccination: IVaccinationShort
}

export interface PreviousVaccinationsResponse {
    vaccinations: IVaccinationPreviousList[]
}
