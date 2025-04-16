import React, { useEffect } from 'react'
import { useFormikContext } from 'formik'

import notificationsStore from '../notifications/NotificationsStore'

const FocusFormError = () => {
    const { errors, isSubmitting, isValidating } = useFormikContext()

    useEffect(() => {
        if (isSubmitting && !isValidating) {
            let keys = Object.keys(errors) as [keyof object]

            if (keys.length > 0) {
                let firstErrorFieldName: string = keys[0]

                // case of field array
                if (Array.isArray(errors[keys[0]])) {
                    let index = 0
                    let fieldName = ''
                    const arrayErrors = errors[keys[0]] as object[]

                    for (const obj of arrayErrors) {
                        if (obj !== undefined) {
                            index = arrayErrors.indexOf(obj)
                            fieldName = Object.keys(obj)[0]
                            break
                        }
                    }

                    firstErrorFieldName = `${keys[0]}.${index}.${fieldName}`
                }

                const errorElement = document.querySelector(`[name^='${firstErrorFieldName}']`) as HTMLElement

                if (errorElement) {
                    // element is not hidden
                    if (errorElement.offsetParent) {
                        errorElement.focus()
                    } else {
                        errorElement.parentElement?.focus()
                    }
                }

                notificationsStore.addError('Проверьте правильность заполнения данных')
            }
        }
    }, [errors, isSubmitting, isValidating])

    return null
}

export default FocusFormError
