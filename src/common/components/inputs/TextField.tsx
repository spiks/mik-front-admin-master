import * as React from 'react'
import {TextField as MaterialTextField} from '@material-ui/core'
import {OutlinedTextFieldProps} from '@material-ui/core/TextField'
import {InputBaseComponentProps} from '@material-ui/core/InputBase'
import InputAdornment from '@material-ui/core/InputAdornment'

import Icon from 'common/components/icon/Icon'

const cx = require('classnames/bind').bind(require('./styles/text-field.scss'))

export interface TextFieldProps extends Partial<OutlinedTextFieldProps> {
    id?: string
    icon?: string
    inputComponent?: React.ElementType<InputBaseComponentProps>
    endAdornment?: React.ReactNode
    errorText?: string
    required?: boolean
}

const TextField: React.FC<TextFieldProps> = props => {
    const {inputComponent, icon, errorText, endAdornment, InputProps, required, error, helperText, InputLabelProps, ...restProps} = props

    return <MaterialTextField
        error={error || !!errorText}
        helperText={errorText || helperText}
        fullWidth
        margin='normal'
        variant='outlined'
        InputProps={{
            classes: {
                root: cx('text-field-root', {'p-0': !props.multiline}),
                notchedOutline: cx('text-field-outline'),
                focused: cx('text-field-focused'),
                error: cx('text-field-error'),
                disabled: cx('disabled')
            },
            innerRef: restProps.inputRef,
            inputComponent: inputComponent,
            startAdornment: icon && (
                <InputAdornment position='start'>
                    <Icon name={icon}/>
                </InputAdornment>
            ) || undefined,
            endAdornment: endAdornment,
            ...InputProps
        }}
        InputLabelProps={{
            ...InputLabelProps,
            classes: {
                root: cx('label-root', {'label-required': required}),
                outlined: cx('label-outlined'),
                focused: cx('label-focused'),
                disabled: cx('disabled'),
                ...InputLabelProps?.classes
            }
        }}
        {...restProps}
    />
}

export default TextField
