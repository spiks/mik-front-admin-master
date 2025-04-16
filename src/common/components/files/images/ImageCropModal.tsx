import React, {useState} from 'react'
import CropperComponent from 'react-cropper'

import {TextBody, TextH2} from '../../text/Text'
import Cropper from '../../cropper/Cropper'
import Button from '../../button/Button'
import Flex from '../../flex/Flex'
import modalStore from '../../modal/ModalStore'

const cx = require('classnames/bind').bind(require('./styles/image-edit-modal.scss'))

interface Props {
    title: string
    subtitle: string
    src: string
    aspectRatio?: number
    onCrop: (file: Blob | null) => Promise<void>
}

const ImageCropModal: React.FC<Props> = ({title, subtitle, src, aspectRatio, onCrop}) => {
    const [cropping, setCropping] = useState(false)
    const cropRef = React.useRef<CropperComponent | null>(null)

    const crop = () => {
        setCropping(true)
        cropRef.current!.getCroppedCanvas().toBlob(async blob => {
            try {
                await onCrop(blob)
                modalStore.closeModal()
            } catch {
                setCropping(false)
            }
        }, new RegExp(/(jpeg|jpg)$/).test(src) && 'image/jpeg' || 'image/png')
    }

    return <>
        <TextH2>{title}</TextH2>
        <TextBody className='mt-8 mb-24'>{subtitle}</TextBody>
        <div className={cx('cropper-wrapper', 'mb-16')}>
            <Cropper
                aspectRatio={aspectRatio}
                getCropRefs={ref => cropRef.current = ref}
                style={{width: '100%', height: '520px'}}
                responsive={false}
                viewMode={1}
                checkCrossOrigin
                autoCropArea={1}
                zoomable={false}
                minCropBoxWidth={30}
                minCropBoxHeight={30}
                guides={false}
                modal
                src={src}/>
        </div>
        <Flex className='mt-24'>
            <Button icon='crop' content='Сохранить изображение' loading={cropping} onClick={crop}/>
        </Flex>
    </>
}

export default ImageCropModal
