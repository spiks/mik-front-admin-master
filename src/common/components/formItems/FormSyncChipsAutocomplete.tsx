import * as React from 'react'
import {FieldProps, getIn} from 'formik'

import SyncChipsAutocomplete, {SyncChipsAutocompleteProps} from 'common/components/autocomplete/SyncChipsAutocomplete'

const FormSyncChipsAutocomplete: React.FC<SyncChipsAutocompleteProps & FieldProps> = props => {
    const {field, form, ...restProps} = props

    const error = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return <SyncChipsAutocomplete {...restProps} name={field.name} error={error} value={field.value}
                                  onChange={value => form.setFieldValue(field.name, value)}/>
}
export default FormSyncChipsAutocomplete
