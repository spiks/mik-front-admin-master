import React from 'react'

import {TextFootnoteBold} from '../text/Text'
import Flex from '../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/styles.scss'))

interface Props {
    className?: string
    quantity?: number
    small?: boolean
}

const Badge: React.FC<Props> = props => {
    const {quantity, className, small} = props

    return <Flex alignItemsCenter justifyContentCenter className={cx('bg-red-900', 'badge', className, {'small': small})}>
        <TextFootnoteBold className='text-base-2'>{quantity ? quantity > 9 ? '9+' : quantity : undefined}</TextFootnoteBold>
    </Flex>
}

export default Badge
