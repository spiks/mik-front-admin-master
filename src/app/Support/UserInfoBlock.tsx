import React, {HTMLProps} from 'react'

import {TextBodyBold, TextCaption} from 'common/components/text/Text'

interface Props extends HTMLProps<HTMLDivElement>{
    title: string
    content?: string
}

const UserInfoBlock: React.FC<Props> = ({title, content, ...props}) => {
    return (
        <div {...props}>
            <TextBodyBold className='text-shade-40'>{title}</TextBodyBold>
            <TextCaption noLineClamp>{content || '-'}</TextCaption>
        </div>
    )
}

export default UserInfoBlock
