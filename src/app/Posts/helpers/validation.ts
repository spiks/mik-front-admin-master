import {FormikErrors} from 'formik'
import {unescape} from 'lodash'

import {PostFormValues} from '../PostDetails'

export const validate = (values: PostFormValues): void | object | Promise<FormikErrors<PostFormValues>> => {
    const content = values.content.replace(/(<[^>]*>?|&nbsp;|\n)/gm, '')

    const errors = {
        content: !content.trim().length && 'Обязательное поле' || unescape(content).trim().length > 10000 && 'Максимум 10000 символов' || undefined
    }

    Object.keys(errors).forEach((key: keyof typeof errors) => {
        if (errors[key] === undefined) {
            delete errors[key]
        }
    })

    return errors
}