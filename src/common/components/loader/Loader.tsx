import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {HTMLProps} from 'react'

const cx = require('classnames/bind').bind(require('./styles/loader.scss'))

interface Props {
    absolute?: boolean
    classNameLoader?: string
}

const Loader: React.FC<Props & HTMLProps<HTMLDivElement>> = props => {
    return <div className={cx('wrapper', props.className, {absolute: props.absolute})}>
        <CircularProgress className={props.classNameLoader}/>
    </div>
}

export default Loader
