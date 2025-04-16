import * as React from 'react'
import {Tooltip as MaterialTooltip} from '@material-ui/core'

const cx = require('classnames/bind').bind(require('./tooltip.scss'))

interface Props {
    text: string
}

export const Tooltip: React.FC<Props> = props => {
    return <MaterialTooltip title={props.text} placement='bottom-start' classes={{tooltip: cx('tooltip')}}>
        {props.children as React.ReactElement}
    </MaterialTooltip>
}