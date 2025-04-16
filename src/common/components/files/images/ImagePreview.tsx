import React from 'react'

import Flex from '../../flex/Flex'
import Button from '../../button/Button'

const cx = require('classnames/bind').bind(require('./styles/images.scss'))

interface Props {
    src: string
    onChangeClick: () => void
    onDeleteClick: () => void
    imageWidth?: string
    imageHeight?: string
}

const ImagePreview: React.FC<Props> = ({src, imageHeight, imageWidth, onChangeClick, onDeleteClick}) => {
    return (
        <Flex alignItemsEnd>
            <img src={src} alt='img' width={imageWidth} height={imageHeight} className={cx('image')}/>
            <Flex column alignItemsStart className='ml-24'>
                <Button icon='edit' content='Изменить изображение' onClick={onChangeClick}/>
                <Button className='mt-8' text red content='Удалить' onClick={onDeleteClick}/>
            </Flex>
        </Flex>
    )
}

export default ImagePreview
