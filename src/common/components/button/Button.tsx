import React, {forwardRef, ReactNode} from 'react'
import ButtonComponent, {ButtonProps} from '@material-ui/core/Button'

import {TextButton} from 'common/components/text/Text'
import {CircularProgress} from '@material-ui/core'
import Icon from '../icon/Icon'

const cx = require('classnames/bind').bind(require('./button.scss'))

interface Props {
    fullWidth?: boolean
    loading?: boolean
    content?: ReactNode
    text?: boolean
    outlined?: boolean
    icon?: string
    red?: boolean
}

const Button = forwardRef<HTMLButtonElement, Props & ButtonProps>((props, ref) => {
    const {children, className, fullWidth, loading, disabled, content, text, outlined, icon, red, ...rest} = props

    return <ButtonComponent
        ref={ref}
        {...rest}
        disabled={disabled || loading}
        className={cx('button',
            {text, outlined: outlined || !!icon, icon: !!icon, loading, red}, className
        )}
        fullWidth={fullWidth}
        variant='contained'
        classes={{disabled: cx('disabled')}}
    >
        <TextButton className={cx('content')}>
            {loading && <CircularProgress className={cx('loader-icon')}/> || !!icon && <Icon className={cx('content-icon')} name={icon}/>}
            {content || children}
        </TextButton>
    </ButtonComponent>
})

export default Button
