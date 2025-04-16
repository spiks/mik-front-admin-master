import React from 'react'

import Icon from '../icon/Icon'
import Flex from '../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/backButton.scss'))

interface Props {
    title: string
    onClick: () => void
}

const PageBackButton: React.FC<Props> = ({title, onClick}) => {
    return (
        <Flex className={cx('back-button')} alignItemsCenter onClick={onClick}>
            <Icon name='arrow_to_left'/>
            <div>{title}</div>
        </Flex>
    )
}

export default PageBackButton
