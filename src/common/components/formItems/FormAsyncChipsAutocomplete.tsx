import * as React from 'react'
import {FieldProps, getIn} from 'formik'

import AsyncChipsAutocomplete, {AsyncChipsAutocompleteProps} from 'common/components/autocomplete/AsyncChipsAutocomplete'

const FormAsyncChipsAutocomplete: React.FC<AsyncChipsAutocompleteProps & FieldProps> = props => {
    const {field, form, ...restProps} = props

    const error = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return <AsyncChipsAutocomplete {...restProps} name={field.name} error={error} value={field.value}
                                   onChange={(value) => form.setFieldValue(field.name, value)} />
}
export default FormAsyncChipsAutocomplete
