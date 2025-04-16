import React from 'react'

import Button from '../../button/Button'
import {TextCaption} from '../../text/Text'
import Flex from '../../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/dropzone.scss'))

interface Props {
    buttonTitle: string
    subtitle: string
    // onChange: () => void
}

const DropZone: React.FC<Props> = ({buttonTitle, subtitle}) => {
    return (
        <Flex centered column className={cx('drop-zone')}>
            <Button icon='plus' content={buttonTitle}/>
            <TextCaption className='mt-10 text-shade-60'>{subtitle}</TextCaption>
        </Flex>
    )
}

export default DropZone
