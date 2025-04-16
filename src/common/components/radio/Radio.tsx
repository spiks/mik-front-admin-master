import React from 'react'
import {Radio as MaterialRadio, FormControlLabel} from '@material-ui/core'
import {RadioProps} from '@material-ui/core/Radio'
import {FormControlLabelProps} from '@material-ui/core/FormControlLabel'

const cx = require('classnames/bind').bind(require('./styles/radio.scss'))

const Radio: React.FC<Partial<FormControlLabelProps> & RadioProps> = (props) => {
    const {label, className, ...rest} = props

    return <FormControlLabel
        className={cx('checkbox-wrapper', className)}
        control={<MaterialRadio
            color='primary'
            classes={{
                root: cx('radio-root')
            }}
            {...rest}
        />}
        classes={{root: cx('label-root')}}
        label={label}
    />
}

export default Radio
