import {Option} from 'common/components/autocomplete/Autocomplete'

import {IVaccination, VaccinationCreateUpdateRequest, VaccinationGender, VaccinationGroup, VaccinationKind} from '../interfaces/models'
import {durationToDatesEntities, formDurationToVaccinationDurationDays, idNameToOption, optionToValue} from './formatters'

export interface DiseaseOption extends Option<string> {
    risk: boolean
}

export interface VaccinationFormDuration {
    years: number | null
    months: number | null
    days: number | null
}

export const initialDuration: VaccinationFormDuration = {
    years: null,
    months: null,
    days: null
}

export interface PreviousVaccinationOption extends Option<string> {
    name: string
    name_display: string
    name_display_next: string
}

export interface VaccinationFormValues {
    id?: string
    kind: VaccinationKind
    group: VaccinationGroup | null
    previous: PreviousVaccinationOption | null
    name: string
    name_display: string
    description?: string
    activities: Option<string>[]
    countries: Option<string>[]
    diseases: DiseaseOption[]
    hobbies: Option<string>[]
    regions: Option<string>[]
    diseases_risk: boolean
    injection_place: string
    duration: VaccinationFormDuration
    next_vaccination_available_after: VaccinationFormDuration
    recommended_age_from: VaccinationFormDuration
    recommended_age_to: VaccinationFormDuration
    enabled: boolean
    interesting_fact: string
    countries_injection_budget: VaccinationFormDuration
    active_from: Date | null
    active_to: Date | null
    revaccination: VaccinationFormDuration
    gender_male: boolean
    gender_female: boolean
    need_revaccination: boolean
}

export const defaultValues: VaccinationFormValues = {
    kind: VaccinationKind.FIRST,
    group: null,
    previous: null,
    name: '',
    name_display: '',
    description: '',
    activities: [],
    countries: [],
    diseases: [],
    hobbies: [],
    regions: [],
    diseases_risk: false,
    injection_place: '',
    duration: {...initialDuration},
    next_vaccination_available_after: {...initialDuration},
    recommended_age_from: {...initialDuration},
    recommended_age_to: {...initialDuration},
    enabled: false,
    interesting_fact: '',
    countries_injection_budget: {...initialDuration},
    active_from: null,
    active_to: null,
    revaccination: {...initialDuration},
    gender_male: true,
    gender_female: true,
    need_revaccination: false
}

export const getInitialValues = (vaccination?: IVaccination, copyMode?: boolean): VaccinationFormValues => {
    if (vaccination) {
        const previousOption: PreviousVaccinationOption | null = copyMode ? null : vaccination.previous && {
            value: vaccination.previous.id,
            label: vaccination.previous.name_display,
            name: vaccination.previous.name,
            name_display: vaccination.previous.name_display,
            name_display_next: vaccination.previous.name
        } || null

        let active_from = null
        let active_to = null
        if (vaccination.active_from && vaccination.active_to) {
            active_from = new Date(vaccination.active_from)
            active_to = new Date(vaccination.active_to)

            active_from.setHours(0, 0, 0, 0)
            active_to.setHours(0, 0, 0, 0)
        }

        return {
            ...vaccination,
            name: copyMode ? '' : vaccination.name,
            previous: previousOption,
            activities: vaccination.activities?.map(idNameToOption) || [],
            countries: vaccination.countries?.map(idNameToOption) || [],
            diseases: vaccination.diseases.map(d => ({value: d.id, label: d.name, risk: d.risk})),
            hobbies: vaccination.hobbies?.map(idNameToOption) || [],
            regions: vaccination.regions?.map(idNameToOption) || [],
            duration: durationToDatesEntities(vaccination.duration),
            next_vaccination_available_after: durationToDatesEntities(vaccination.next_vaccination_available_after),
            recommended_age_from: durationToDatesEntities(vaccination.recommended_age_from),
            recommended_age_to: durationToDatesEntities(vaccination.recommended_age_to),
            countries_injection_budget: durationToDatesEntities(vaccination.countries_injection_budget),
            active_from,
            active_to,
            gender_male: !vaccination.gender || vaccination.gender === VaccinationGender.MALE,
            gender_female: !vaccination.gender || vaccination.gender === VaccinationGender.FEMALE,
            need_revaccination: !!vaccination.revaccination?.count || false,
            revaccination: durationToDatesEntities(vaccination.revaccination)
        }
    }

    return defaultValues
}

export const mapFormToRequestData = (values: VaccinationFormValues): VaccinationCreateUpdateRequest => {
    let gender: VaccinationGender | undefined = undefined

    if (values.gender_male) {
        if (!values.gender_female) {
            gender = VaccinationGender.MALE
        }
    } else if (values.gender_female) {
        gender = VaccinationGender.FEMALE
    }

    const {gender_female, gender_male, need_revaccination, ...valuesToSend} = values

    return {
        ...valuesToSend,
        gender,
        name: values.previous && values.previous.name || values.name || values.name_display,
        name_display: !values.name ? null : values.name_display,
        activities: values.activities.map(optionToValue),
        countries: values.countries.map(optionToValue),
        diseases: values.diseases.map(optionToValue),
        hobbies: values.hobbies.map(optionToValue),
        regions: values.regions.map(optionToValue),
        diseases_risk: values.diseases_risk || undefined,
        duration: formDurationToVaccinationDurationDays(values.duration)!,
        next_vaccination_available_after: formDurationToVaccinationDurationDays(values.next_vaccination_available_after),
        recommended_age_from: formDurationToVaccinationDurationDays(values.recommended_age_from),
        recommended_age_to: formDurationToVaccinationDurationDays(values.recommended_age_to),
        countries_injection_budget: values.group === VaccinationGroup.TS
            && formDurationToVaccinationDurationDays(values.countries_injection_budget)
            || undefined,
        previous_id: values.previous?.value,
        revaccination: formDurationToVaccinationDurationDays(values.revaccination)
    }
}
