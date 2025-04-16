import React from 'react'
import {TextCaption} from '../../text/Text'
import Icon from '../../icon/Icon'
import Flex from '../../flex/Flex'

const cx = require('classnames/bind').bind(require('../styles/actionLink.scss'))

interface Props {
    title: string
    icon: string
    onClick: () => void
    red?: boolean
}

const ActionLink: React.FC<Props> = ({title, icon, red, onClick}) => {
    return (
        <Flex alignItemsCenter className={cx('action-link', red && 'red' || 'primary')}
              onClick={onClick}
        >
            <TextCaption>{title}</TextCaption>
            <Icon className='ml-8' name={icon}/>
        </Flex>
    )
}

export default ActionLink
