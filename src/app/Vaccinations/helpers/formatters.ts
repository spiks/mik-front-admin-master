import {IVaccinationDuration, VaccinationDurationUnit} from '../interfaces/models'

import {initialDuration, VaccinationFormDuration} from './data'
import {Option} from 'common/components/autocomplete/Autocomplete'

export const durationToDatesEntities = (vaccinationDuration?: IVaccinationDuration): VaccinationFormDuration => {
    if (!vaccinationDuration) {
        return initialDuration
    }

    const {unit, count} = vaccinationDuration

    switch (unit) {
        case VaccinationDurationUnit.YEARS:
            return {
                ...initialDuration,
                years: count
            }
        case VaccinationDurationUnit.MONTHS:
            return {
                ...initialDuration,
                years: Math.floor(count / 12),
                months: count % 12
            }
        case VaccinationDurationUnit.DAYS:
            let days = count

            const years = Math.floor(days / 365)
            days -= years * 365

            const months = Math.floor(days / 30)
            days -= months * 30

            return {
                years,
                months,
                days
            }
        default:
            return initialDuration
    }
}

export const formDurationToVaccinationDurationDays = (formDuration: VaccinationFormDuration): IVaccinationDuration | null => {
    const days = (formDuration.years || 0) * 365 + (formDuration.months || 0) * 30 + (formDuration.days || 0)

    if (days === 0) {
        return null
    }

    return {
        unit: VaccinationDurationUnit.DAYS,
        count: days
    }
}

export const idNameToOption = (idNameEntity: {id: string, name: string}): Option<string> => ({value: idNameEntity.id, label: idNameEntity.name})

export const optionToValue = <T = string>(option: Option<T>): T => option.value
