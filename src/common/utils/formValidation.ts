import * as Yup from 'yup'

import {phonePattern, spacesPattern} from 'common/utils/patterns'
import {mixed} from 'yup'

export const requiredMessage: string = 'Обязательное поле'

export const requiredNumberMessage: string = 'Введите числовое значение'

export const wrongUrlFormatText: string = 'Неверный формат ссылки'

export const wrongFormat: string = 'Неверный формат'

const minStringMessage = (min: number) => `Минимум ${min} символов`
export const maxStringMessage = (max: number) => `Максимум ${max} символов`

const minNumberMessage = (min: number) => `Не меньше ${min}`
const maxNumberMessage = (max: number) => `Не больше ${max}`

export const equalPasswordText: string = 'Пароли не совпадают'

const numberSchema = Yup.number().transform((currentValue, originalValue) => {
    return originalValue === '' ? undefined : isNaN(currentValue) ? undefined : currentValue
})

// const stringSchema = Yup.string().transform((transform))

const date = Yup.date().typeError('Неверный формат даты')

export const minString = (min: number) => Yup.string().nullable().min(min, params => minStringMessage(params.min))
export const maxString = (max: number) => Yup.string().nullable().max(max, params => maxStringMessage(params.max))
export const minMaxString = (min: number, max: number) => minString(min).concat(maxString(max))

export const minNumber = (min: number) => numberSchema.min(min, params => minNumberMessage(params.min))
export const maxNumber = (max: number) => numberSchema.max(max, params => maxNumberMessage(params.max))
export const minMaxNumber = (min: number, max: number) => minNumber(min).concat(maxNumber(max))

export const nullableDate = (message = requiredMessage) => date.nullable()
export const minDate = (min: Date) => date.min(
    min,
    `Минимальная дата - ${min.getDate() >= 10 && min.getDate() || '0' + min.getDate().toString()}/${min.getMonth() + 1 >= 10 && min.getMonth() + 1 || '0' + (min.getMonth() + 1).toString()}/${min.getFullYear()}`
)
// export const maxDate = (max: Date) => date.max(max, 'Не может быть меньше даты начала')

export const shouldBeEmpty = (message: string) => mixed().test(
    'is-null',
    message,
    value => !value
)

export const requiredString = (message = requiredMessage) => Yup.string().trim().required(message)

export const requiredNumber = (message = requiredNumberMessage) => numberSchema.required(message)

export const requiredBoolean = (message = requiredMessage) => Yup.boolean().oneOf([true], message)

export const requiredDate = (message = requiredMessage) => date.required(message).nullable()

export const requiredMixed = (message = requiredMessage) => Yup.mixed().required(message)

export const requiredArray = <T>(message = requiredMessage) => Yup.array<T>().compact().required(message)

export const email: Yup.StringSchema = Yup.string().email(wrongFormat)

export const password = (min = 6, max = 40): Yup.StringSchema<string | null> => minMaxString(min, max)

export const url: Yup.StringSchema<string | null> = Yup.string().nullable().url(wrongUrlFormatText)

export const phone: Yup.StringSchema = Yup.string().matches(phonePattern, {message: wrongFormat, excludeEmptyString: true})

export const object = <T extends object>(fields: Yup.ObjectSchemaDefinition<T>) => Yup.object().shape<T>(fields)

export const requiredOption = (message = requiredMessage) => Yup.mixed().test({name: 'optionTest', message, test: (value) => value?.value})

export const checkSpaces: Yup.StringSchema = Yup.string().matches(spacesPattern, wrongFormat)

export const isEqualWith  = (field: string, message: string) => Yup.string().oneOf([Yup.ref(field), null], message)
