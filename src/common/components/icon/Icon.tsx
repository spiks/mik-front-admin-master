import React, {HTMLAttributes} from 'react'

const cx = require('classnames/bind').bind(require('./styles/icon.scss'))

interface Props {
    name: string
}

const Icon: React.FC<Props & HTMLAttributes<HTMLOrSVGElement>> = props => {
    const {name, onClick, className, ...rest} = props

    const Icon = require(`!svg-react-loader?name=Icon!common/icons/${name}.svg`)

    return <Icon style={{...props.style}} className={cx('icon', className, {'pointer': !!onClick})} onClick={onClick} {...rest}/>
}

export default Icon
