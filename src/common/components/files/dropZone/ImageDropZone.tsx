import React from 'react'

import {TextCaption} from '../../text/Text'

import Button from '../../button/Button'
import {IFile} from '../../../interfaces/files'
import Loader from '../../loader/Loader'

import FileDropZone from './FileDropZone'

const cx = require('classnames/bind').bind(require('./styles/dropzone.scss'))

interface Props {
    buttonTitle: string
    subtitle: string
    maxFileMb: number
    onUploadFinish: (data: IFile) => void
    inputName?: string
    className?: string
    externalError?: string
}

const ImageDropZone: React.FC<Props> = props => {
    return (
        <FileDropZone accept={['image/png', 'image/jpg', 'image/jpeg']}
                      maxFileSize={props.maxFileMb * 1024 * 1024}
                      inputName={props.inputName}
                      onUploadFinish={props.onUploadFinish} className={props.className}>
            {({isDragReject, isFileLarge, fileIsSet, uploadingError}) => {
                const text =
                    isDragReject && 'Разрешенные форматы: JPG, PNG' ||
                    isFileLarge && `Максимальный размер файла - ${props.maxFileMb} MB` ||
                    !fileIsSet && props.subtitle ||
                    uploadingError && 'Неудачно, попробуйте еще раз' || null

                const textContent = text && <TextCaption className={cx('mt-10', !!props.externalError && 'text-red-900' || 'text-shade-60')}>
                    {text}
                </TextCaption> || <TextCaption className='mt-10 text-shade-60'>
                    Загрузка...
                </TextCaption>

                const buttonContent =
                    (!fileIsSet || uploadingError) && <Button icon='plus' content={props.buttonTitle}/> || <Loader/>

                return <>
                    {buttonContent}
                    {textContent}
                </>
            }}
        </FileDropZone>
    )
}

export default ImageDropZone
