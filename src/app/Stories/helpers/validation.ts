import {array, boolean, mixed} from 'yup'

import {maxString, object, requiredString, url} from 'common/utils/formValidation'

export const validationSchema = object({
    title: maxString(55).concat(requiredString()),
    image: requiredString(),
    frames: array().of(object({
        header1: maxString(55).concat(requiredString()),
        image: requiredString(),
        description: maxString(215).concat(requiredString()),
        action_available: boolean(),
        action_text: mixed().when(['action_available'], {is: true, then: maxString(30).concat(requiredString())}),
        action_url: mixed().when(['action_available'], {is: true, then: url.concat(requiredString())})
    }))
})
