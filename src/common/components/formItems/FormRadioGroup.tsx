import * as React from 'react'
import {FieldProps} from 'formik'
import RadioGroup, {RadioGroupProps} from '@material-ui/core/RadioGroup'
import {FormControlLabelProps} from '@material-ui/core/FormControlLabel'

const FormRadioGroup: React.FC<Partial<FormControlLabelProps & RadioGroupProps & FieldProps>> = props => {
    const {field, form, ...restProps} = props

    return <RadioGroup {...field} onChange={props.onChange ? props.onChange : field?.onChange} {...restProps}/>
}

export default FormRadioGroup
