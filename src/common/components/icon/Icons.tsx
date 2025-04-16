import React, {HTMLAttributes} from 'react'

import Icon from './Icon'

const cx = require('classnames/bind').bind(require('./styles/icons.scss'))

type IconProps = HTMLAttributes<HTMLOrSVGElement>

export const IconClose: React.FC<IconProps> = ({className, ...props}) => (
    <Icon name='close' className={cx('icon-close', className)} {...props}/>
)

export const IconCopy: React.FC<IconProps> = ({className, ...props}) => (
    <Icon name='copy' className={cx('icon-copy', className)} {...props}/>
)

export const IconEdit: React.FC<IconProps> = ({className, ...props}) => (
    <Icon name='edit' className={cx('icon-edit', className)} {...props}/>
)
