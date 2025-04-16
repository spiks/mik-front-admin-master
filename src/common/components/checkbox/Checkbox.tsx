import React from 'react'
import {Checkbox as MaterialCheckbox, FormControlLabel} from '@material-ui/core'
import {CheckboxProps} from '@material-ui/core/Checkbox'
import {FormControlLabelProps} from '@material-ui/core/FormControlLabel'

const cx = require('classnames/bind').bind(require('./styles/styles.scss'))

const Checkbox: React.FC<Partial<FormControlLabelProps> & CheckboxProps> = props => {
    const {label, className, ...rest} = props

    return <FormControlLabel
        className={cx('checkbox-wrapper', className)}
        classes={{
            disabled: cx('disabled')
        }}
        control={<MaterialCheckbox
            classes={{
                root: cx('root'),
                colorPrimary: cx('color-primary'),
                checked: cx('checked')
            }}
            color='primary'
            {...rest}/>
        }
        label={label}
    />
}

export default Checkbox
