import * as React from 'react'

import {TextBody, TextBodyBold} from 'common/components/text/Text'
import {ReactNode} from 'react'

interface Props {
    title?: ReactNode
    text?: ReactNode
    className?: string
}

const cx = require('classnames/bind').bind(require('./screen-placeholder.scss'))

const ScreenPlaceholder: React.FC<Props> = props => {
    return <div className={cx('screen', props.className)}>
        {props.title && (typeof props.text === 'string'
            ? <TextBodyBold className='text-base-1'>{props.title}</TextBodyBold>
            : props.title)}
        {props.text && (typeof props.text === 'string'
            ? <TextBody className='text-base-1 mt-10'>{props.text}</TextBody>
            : props.text)}
        {!props.title && !props.text && 'There is no such route'}
    </div>
}

export default ScreenPlaceholder
