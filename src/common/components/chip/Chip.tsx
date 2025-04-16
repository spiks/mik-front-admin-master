import * as React from 'react'
import {Chip as MaterialChip} from '@material-ui/core'

const cx = require('classnames/bind').bind(require('./chip.scss'))

interface Props {
    label: string
    onDelete: () => void
}

const Chip: React.FC<Props> = props => {
    return (
        <MaterialChip
            className={cx('chip-item')}
            classes={{
                deleteIcon: cx('delete-icon')
            }}
            label={props.label}
            clickable={false}
            onDelete={props.onDelete}/>
    )
}

export default Chip
