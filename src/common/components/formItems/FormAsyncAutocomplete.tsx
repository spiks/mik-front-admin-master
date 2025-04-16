import * as React from 'react'
import {FieldProps, getIn} from 'formik'

import AsyncAutocomplete, {AsyncAutocompleteProps} from '../autocomplete/AsyncAutocomplete'
import {Option} from '../autocomplete/Autocomplete'

interface Props {
    onChange?: (option: Option) => void
}

const FormAsyncAutocomplete: React.FC<Props & AsyncAutocompleteProps & FieldProps> = ({form, field, onChange, ...rest}) => {
    const error = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return <AsyncAutocomplete
        value={field.value}
        name={field.name}
        error={error}
        onChange={(value: Option) => {
            form.setFieldValue(field.name, value)
            onChange?.(value)
        }}
        {...rest}
    />
}

export default FormAsyncAutocomplete
