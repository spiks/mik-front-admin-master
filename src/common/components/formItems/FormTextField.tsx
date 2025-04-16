import * as React from 'react'
import {OutlinedTextFieldProps} from '@material-ui/core/TextField'
import {InputBaseComponentProps} from '@material-ui/core/InputBase'
import {FieldProps, getIn} from 'formik'

import TextField from 'common/components/inputs/TextField'

export interface BaseFormFieldProps {
    label: string
}

interface OwnProps {
    icon?: string
    inputComponent?: React.ElementType<InputBaseComponentProps>
    endAdornment?: React.ReactNode
    helperText?: string
}

export type FormTextFieldProps = Partial<OutlinedTextFieldProps> & OwnProps & FieldProps & BaseFormFieldProps

const FormTextField: React.FC<FormTextFieldProps> = props => {
    const {form, field, onChange, helperText, ...restProps} = props

    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return <TextField
        id={`${props.field.name}-text-field`}
        errorText={errorText}
        name={field.name}
        value={(field.value || field.value === 0) ? field.value : ''}
        onChange={onChange || field.onChange}
        helperText={helperText}
        onBlur={field.onBlur}
        {...restProps}
    />
}

export default FormTextField
