import * as React from 'react'
import {FieldProps} from 'formik'

import FormTextField, {FormTextFieldProps} from './FormTextField'

const FormInput: React.FC<FormTextFieldProps & FieldProps> = props => {
    return <FormTextField {...props}/>
}

export default FormInput
