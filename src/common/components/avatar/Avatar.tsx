import React, {ReactElement} from 'react'
import {Avatar as AvatarMaterial} from '@material-ui/core'

interface Props {
    src?: string
    children?: ReactElement
    width?: number
    height?: number
    className?: string
}

const Avatar: React.FC<Props> = props => {
    const {className, children, src, width = 36, height = 36} = props

    return <AvatarMaterial className={className}
                           src={src}
                           style={{width, height, fontSize: 14, backgroundColor: 'transparent'}}>{children}</AvatarMaterial>
}

export default Avatar
