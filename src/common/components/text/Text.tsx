import * as React from 'react'
import {HTMLAttributes} from 'react'

const cx = require('classnames/bind').bind(require('./text.scss'))

interface Props extends HTMLAttributes<HTMLDivElement> {
    uppercase?: boolean
    ellipsis?: boolean
    noLineClamp?: boolean
}

interface BaseComponentProps extends Props {
    specialClassName: string
}

export const BaseText: React.FC<BaseComponentProps> = props => {
    const {className, specialClassName, uppercase, ellipsis, noLineClamp, ...restProps} = props

    return (
        <div {...restProps} className={cx('text-base', specialClassName, className, {uppercase, ellipsis, 'no-line-clamp' : noLineClamp})}>
            {props.children}
        </div>
    )
}

export const TextH1: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('h1')}>
        {props.children}
    </BaseText>
)

export const TextH2: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('h2')}>
        {props.children}
    </BaseText>
)

export const TextBody: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('body')}>
        {props.children}
    </BaseText>
)

export const TextBodyBold: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('body', 'bold')}>
        {props.children}
    </BaseText>
)

export const TextFootnote: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('footnote')}>
        {props.children}
    </BaseText>
)

export const TextFootnoteBold: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('footnote', 'bold')}>
        {props.children}
    </BaseText>
)

export const TextButton: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('button')}>
        {props.children}
    </BaseText>
)

export const TextCaption: React.FC<Props> = props => (
    <BaseText {...props} specialClassName={cx('caption')}>
        {props.children}
    </BaseText>
)
