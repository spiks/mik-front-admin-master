import React from 'react'
import {FieldProps} from 'formik'

import FormInput from './FormInput'
import {FormTextFieldProps} from './FormTextField'

interface Props {
    allowZero?: boolean
}

const FormInputInteger: React.FC<Props & FormTextFieldProps & FieldProps> = ({allowZero = true, onChange, ...props}) => {
    return (
        <FormInput
            value={(props.field.value || (allowZero && props.field.value === 0)) ? props.field.value : ''}
            onChange={e => {
                let val = +e.target.value

                let newValue: number | string = Number.isInteger(val) && val || ''

                if (allowZero) {
                    newValue = (Number.isInteger(val) && e.target.value !== '') ? val : ''
                }

                props.form.setFieldValue(props.field.name, newValue)
            }}
            {...props}
        />
    )
}

export default FormInputInteger
