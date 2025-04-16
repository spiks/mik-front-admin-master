import {mixed} from 'yup'

import {
    maxString,
    minDate,
    nullableDate,
    object,
    requiredArray,
    requiredDate,
    requiredMessage,
    requiredOption,
    requiredString,
    shouldBeEmpty
} from 'common/utils/formValidation'
import {VaccinationGroup, VaccinationKind} from '../interfaces/models'
import {VaccinationFormDuration, VaccinationFormValues} from './data'
import {FormikErrors} from 'formik/dist/types'
import {formDurationToVaccinationDurationDays} from './formatters'

export const validationSchema = object({
    group: requiredString(),
    kind: requiredString(),
    previous: mixed().when('kind', (kind: VaccinationKind) => {
        if ([VaccinationKind.SUBSEQUENT, VaccinationKind.LAST].includes(kind)) {
            return requiredOption()
        }

        return undefined
    }),
    name_display: maxString(100).concat(requiredString()),
    description: maxString(1500),
    injection_place: maxString(300),
    diseases: requiredArray(),
    interesting_fact: maxString(550),
    countries: mixed().when('group', (group: VaccinationGroup) => {
        if ([VaccinationGroup.TS].includes(group)) {
            return requiredArray()
        }

        return undefined
    }),
    active_from: mixed().when('group', (group: VaccinationGroup) => {
        if (![VaccinationGroup.OTHER, VaccinationGroup.KEP].includes(group)) {
            return undefined
        }

        return nullableDate()
    }),
    active_to: mixed().when(['active_from', 'group'], (activeFrom: any, group: VaccinationGroup) => {
        if (![VaccinationGroup.OTHER, VaccinationGroup.KEP].includes(group)) {
            return undefined
        }

        // @ts-ignore
        if (activeFrom instanceof Date && !isNaN(activeFrom)) {
            return requiredDate().concat(minDate(activeFrom))
        }

        return shouldBeEmpty('Требуется начальная дата промежутка')
    })
})

export const validate = (values: VaccinationFormValues): void | object | Promise<FormikErrors<VaccinationFormValues>> => {
    const {duration, next_vaccination_available_after, kind, group, recommended_age_from,
        recommended_age_to, countries_injection_budget, revaccination, need_revaccination} = values

    const durationValidateMaxValue = (duration: VaccinationFormDuration) => {
        if (Object.values(duration).some(value => value && value.toString().length > 2)) {
            return 'В каждом поле должно быть не более 2 символов'
        }

        return undefined
    }

    const durationFormatRequired = (duration: VaccinationFormDuration) => {
        if (Object.values(duration).every(v => v === null || v === '')) {
            return requiredMessage
        }

        return undefined
    }

    const shouldBeLessThanDurationField = (formDuration: VaccinationFormDuration) => {
        const durationFieldDays = formDurationToVaccinationDurationDays(duration)
        const formDurationDays = formDurationToVaccinationDurationDays(formDuration)

        if ((formDurationDays?.count || 0) > (durationFieldDays?.count || 0)) {
            return 'Не должно быть больше значения "Вакцинация действует в течение"'
        }

        return undefined
    }

    const recommendedAgeTo = () => {
        const fromDays = formDurationToVaccinationDurationDays(recommended_age_from)
        const toDays = formDurationToVaccinationDurationDays(recommended_age_to)

        if ((fromDays?.count || 0) > (toDays?.count || 0)) {
            return 'Значение ОТ не должно быть больше, чем ДО'
        }

        return undefined
    }

    const errors: object = {
        duration: durationFormatRequired(duration) || durationValidateMaxValue(duration),
        next_vaccination_available_after: ![VaccinationKind.LAST, VaccinationKind.ONCE].includes(kind)
            && durationFormatRequired(next_vaccination_available_after) || durationValidateMaxValue(next_vaccination_available_after),
        revaccination: ([VaccinationKind.LAST, VaccinationKind.ONCE].includes(kind) && need_revaccination)
            && (durationFormatRequired(revaccination) || shouldBeLessThanDurationField(revaccination)) || durationValidateMaxValue(revaccination),
        recommended_age_from: group === VaccinationGroup.NK
            && durationFormatRequired(recommended_age_from) || durationValidateMaxValue(recommended_age_from),
        recommended_age_to: recommendedAgeTo() || group === VaccinationGroup.NK
            && durationFormatRequired(recommended_age_to) || durationValidateMaxValue(recommended_age_to),
        countries_injection_budget: group === VaccinationGroup.TS
            && durationFormatRequired(countries_injection_budget) || durationValidateMaxValue(countries_injection_budget)
    }

    Object.keys(errors).forEach((key: keyof typeof errors) => {
        if (errors[key] === undefined) {
            delete errors[key]
        }
    })

    return errors
}
