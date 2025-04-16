import * as React from 'react'
import {FieldProps} from 'formik'

import FormTextField, {FormTextFieldProps} from './FormTextField'

interface Props {
    rows?: number
    helperText?: string
}

const FormTextArea: React.FC<FormTextFieldProps & FieldProps & Props> = props => {
    const {rows, helperText, ...restProps} = props

    return <FormTextField
        multiline
        minRows={rows || 4}
        helperText={helperText}
        {...restProps}
    />
}

export default FormTextArea
