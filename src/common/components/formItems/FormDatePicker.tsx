import * as React from 'react'
import {KeyboardDatePicker} from '@material-ui/pickers'
import {FieldProps, getIn} from 'formik'

import TextField from 'common/components/inputs/TextField'

import {BaseFormFieldProps} from './FormTextField'

interface Props extends BaseFormFieldProps {
    className: string
    onChange?: (date: Date) => void
    required?: boolean
}

class FormDatePicker extends React.Component<Props & FieldProps> {
    render() {
        const {form, field, className, label, required} = this.props
        const error = getIn(form.touched, field.name) && getIn(form.errors, field.name)
        const onChange = (date: Date) => !!this.props.onChange ? this.props.onChange(date) : form.setFieldValue(field.name, date, true)

        return (
            <KeyboardDatePicker
                label={label}
                className={className}
                helperText={error}
                error={!!error}
                autoOk
                fullWidth
                margin='normal'
                inputVariant='outlined'
                variant='inline'
                placeholder='31/12/2019'
                format='dd/MM/yyyy'
                mask='__/__/____'
                {...field}
                TextFieldComponent={TextField as any}
                onChange={onChange}
            />
        )
    }
}

export default FormDatePicker
