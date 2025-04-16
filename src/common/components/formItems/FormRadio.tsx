import React from 'react'
import {FieldProps} from 'formik'
import {RadioProps, FormControlLabelProps} from '@material-ui/core'

import Radio from 'common/components/radio/Radio'

const FormRadio: React.FC<FormControlLabelProps & RadioProps & FieldProps> = props => {
    const {field, form, ...restProps} = props

    return <Radio {...field} {...restProps} checked={field.value === restProps.value} value={restProps.value}/>
}

export default React.memo(FormRadio)
