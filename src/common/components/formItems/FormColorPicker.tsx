import React, {useState} from 'react'
import {FieldProps} from 'formik'
import InputAdornment from '@material-ui/core/InputAdornment'

import FormTextField, {FormTextFieldProps} from './FormTextField'
import ColorPicker from '../colorPicker/ColorPicker'

const cx = require('classnames/bind').bind(require('./styles/formColorPicker.scss'))

const FormColorPicker: React.FC<FieldProps & FormTextFieldProps> = ({disabled, ...props}) => {
    const [open, setOpen] = useState(false)

    return <div className='relative'>
        <FormTextField
            onClick={() => !disabled && setOpen(true) || undefined}
            disabled={open || disabled}
            InputProps={{
                ...props.InputProps,
                startAdornment: (
                    <InputAdornment position='start'>
                        <div style={{width: 16, height: 16, borderRadius: '50%', border: '1px solid #E2E2E2', backgroundColor: props.field.value}}/>
                    </InputAdornment>
                ),
                classes: {
                    input: cx('search-input')
                }
            }}
            {...props}
        />
        {open && <div className={cx('popup')}>
            <div className={cx('cover')} onClick={() => setOpen(false)}/>
            <ColorPicker color={props.field.value} onChange={color => props.form.setFieldValue(props.field.name, color.hex.toUpperCase(), false)}/>
        </div>}
    </div>
}

export default FormColorPicker
