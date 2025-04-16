import React from 'react'

import Flex from '../flex/Flex'
import {TextCaption, TextH1} from '../text/Text'

interface Props {
    title: string
    subtitle?: string
}

const PageTitle: React.FC<Props> = ({title, subtitle}) => {
    return (
        <Flex inline column>
            <TextH1>{title}</TextH1>
            <TextCaption className='text-shade-60 mt-2'>{subtitle}</TextCaption>
        </Flex>
    )
}

export default PageTitle
