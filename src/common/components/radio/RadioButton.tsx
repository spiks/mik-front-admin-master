import * as React from 'react'

import {TextH1} from '../text/Text'
import {RadioContext} from './RadioProvider'

const cx = require('classnames/bind').bind(require('./styles/radio.scss'))

interface Props extends React.HTMLProps<HTMLHeadingElement> {
    value: string
}

const RadioButton: React.FC<Props> = props => {
    const {className, ...restProps} = props
    const {value: radioValue, onChange} = React.useContext(RadioContext)

    return (
        <TextH1
            className={cx({'text-primary-900': radioValue === props.value}, 'pointer', className)}
            onClick={() => onChange(props.value)}
            {...restProps}>
            {props.children}
        </TextH1>
    )
}

export default RadioButton
