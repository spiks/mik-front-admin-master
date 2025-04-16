import * as React from 'react'
import {FieldProps, getIn} from 'formik'
import {useEffect} from 'react'

import api from 'services/ApiService'

import ImagePreview from '../files/images/ImagePreview'
import ImageDropZone from '../files/dropZone/ImageDropZone'
import modalStore from '../modal/ModalStore'
import ImageCropModal from '../files/images/ImageCropModal'
import {usePrevious} from '../../utils/hooks'

interface Props {
    dropzoneProps: {
        buttonTitle: string
        subtitle?: string
        maxFileMb?: number
    }

    previewProps: {
        height?: string
        width?: string
    }

    cropModalProps: {
        title: string
        subtitle: string
        aspectRatio?: number
    }

    className?: string
}

const FormImage: React.FC<FieldProps & Props> = ({field, form, className, previewProps, dropzoneProps: {buttonTitle, maxFileMb = 5, subtitle = `JPEG или PNG. Не более ${maxFileMb}Mb.`}, cropModalProps}) => {
    const prevValue = usePrevious(field.value || '')

    // open crop modal after file is loaded
    useEffect(() => {
        if (prevValue === '' && field.value !== '') {
            openEditModal()
        }
    }, [field.value])

    const onCrop = async (blob: Blob) => {
        const formData = new FormData()
        formData.append('file', blob)
        const file = await api.Files.upload(formData)

        form.setFieldValue(field.name, file.url)
    }

    const openEditModal = () => {
        modalStore.openModal({
            content: <ImageCropModal
                aspectRatio={cropModalProps.aspectRatio}
                onCrop={onCrop}
                title={cropModalProps.title}
                subtitle={cropModalProps.subtitle}
                src={field.value}/>,
            withCross: true
        })
    }

    let content

    const error = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    if (field.value) {
        content = <ImagePreview
            src={field.value}
            onChangeClick={openEditModal}
            onDeleteClick={() => form.setFieldValue(field.name, '')}
            imageHeight={previewProps.height}
            imageWidth={previewProps.width}/>
    } else {
        content = <ImageDropZone
            maxFileMb={maxFileMb}
            onUploadFinish={file => form.setFieldValue(field.name, file.url)}
            subtitle={error || subtitle}
            buttonTitle={buttonTitle}
            inputName={field.name}
            externalError={error}
        />
    }

    return <div className={className}>
        {content}
    </div>
}

export default FormImage
