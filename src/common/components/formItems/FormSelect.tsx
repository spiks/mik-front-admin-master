import * as React from 'react'
import {FieldProps} from 'formik'
import {MenuItem} from '@material-ui/core'

import FormTextField, {FormTextFieldProps} from './FormTextField'
import {Option} from '../autocomplete/Autocomplete'

interface Props {
    options: Option[]
    renderOption?: (option: Option) => React.ReactNode
    onChange?: (option: Option) => void
}

const FormSelect: React.FC<Props & FieldProps & FormTextFieldProps> = ({options, renderOption, onChange, ...props}) => {
    const renderOpt = renderOption || ((option) => option.label)

    return <FormTextField
        select
        onChange={event => {
            props.form.setFieldValue(props.field.name, event.target.value)
        }}
        {...props}
    >
        {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
                {renderOpt(option)}
            </MenuItem>)
        )}
    </FormTextField>
}

export default FormSelect
