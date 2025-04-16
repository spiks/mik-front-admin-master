import React from 'react'
import {Container as MaterialContainer, ContainerProps} from '@material-ui/core'

const cx = require('classnames/bind').bind(require('./styles/container.scss'))

const Container: React.FC<ContainerProps> = props => {
    return (
        <MaterialContainer
            classes={{maxWidthXs: cx('max-width-xs')}}
            {...props}>
            {props.children}
        </MaterialContainer>
    )
}

export default Container
