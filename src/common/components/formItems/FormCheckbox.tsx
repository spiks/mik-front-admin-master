import React from 'react'
import {FieldProps} from 'formik'
import {CheckboxProps} from '@material-ui/core/Checkbox'
import {FormControlLabelProps} from '@material-ui/core/FormControlLabel'

import Checkbox from 'common/components/checkbox/Checkbox'

const FormCheckbox: React.FC<FormControlLabelProps & CheckboxProps & FieldProps> = props => {
    const {field, form, ...restProps} = props

    return <Checkbox {...field} {...restProps} checked={!!field.value} value={!!field.value}/>
}

export default React.memo(FormCheckbox)
