import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import api from 'services/ApiService'

import {IFile} from '../../../interfaces/files'
import Flex from '../../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/dropzone.scss'))

interface Props {
    accept: string[]
    onUploadFinish: (data: IFile) => void
    children: (data: {
        hasError: boolean
        isDragActive: boolean
        fileIsSet: boolean
        isDragReject: boolean
        isFileLarge: boolean
        uploadingError: boolean
    }) => JSX.Element
    inputName?: string
    maxFileSize?: number // bytes
    className?: string
    hasExternalError?: boolean
    validateFileOnDrop?: (file: File) => Promise<boolean>
}

const FileDropZone: React.FC<Props> =
    ({accept, onUploadFinish, maxFileSize, validateFileOnDrop, hasExternalError, className, inputName, children}) => {
        const [uploadingError, setUploadingError] = useState(!!hasExternalError)

        const onDrop = useCallback(async (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return

            setUploadingError(false)

            if (validateFileOnDrop !== undefined && !await validateFileOnDrop(acceptedFiles[0])) return

            const formData = new FormData()
            formData.append('file', acceptedFiles[0])

            try {
                const file = await api.Files.upload(formData)
                onUploadFinish?.(file)
            } catch (e) {
                setUploadingError(true)
            }
        }, [])

        const {isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({
            onDrop,
            accept,
            minSize: 0,
            multiple: false,
            maxSize: maxFileSize
        })

        const isFileLarge = !!maxFileSize && rejectedFiles.length > 0 && rejectedFiles[0].size > maxFileSize

        const hasError = isDragReject || isFileLarge

        const fileIsSet = acceptedFiles.length > 0 && !!acceptedFiles[0].name

        return <Flex
            centered column
            className={cx('dropzone', className, {hasError: hasError || hasExternalError, 'is-drag-active': isDragActive})}
            {...getRootProps()}
        >
            <input name={inputName} {...getInputProps()} />
            {children({hasError, isDragActive, fileIsSet, isDragReject, isFileLarge, uploadingError})}
        </Flex>
    }

export default FileDropZone
