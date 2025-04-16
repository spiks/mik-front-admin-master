import React, {MutableRefObject, useRef, useState} from 'react'
import {FieldProps} from 'formik/dist/Field'
import {InputBaseComponentProps} from '@material-ui/core/InputBase'
import {CircularProgress} from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'

import api from 'services/ApiService'

import TextField from 'common/components/inputs/TextField'
import Icon from 'common/components/icon/Icon'
import Flex from 'common/components/flex/Flex'
import Radio from 'common/components/radio/Radio'

import Button from '../button/Button'
import {TextBody, TextCaption} from '../text/Text'
import {IconClose} from '../icon/Icons'

const cx = require('classnames/bind').bind(require('./styles/url-file-field.scss'))

export enum UrlFileFieldType {
    URL = 'url',
    FILE = 'file'
}

export interface UrlFileFieldProps extends Partial<InputBaseComponentProps> {
    defaultType: UrlFileFieldType
    urlField: {
        label: string
        placeholder?: string
    }
    fileField: {
        label: string
        uploadButtonLabel?: string
        fileType?: string
        fileTypeText?: string
    }
}

const formatErrors = (errors: FieldProps['form']['errors'], field: string): string | undefined => {
    const fieldErrors = errors[field]

    if (typeof fieldErrors === 'string') {
        return fieldErrors
    } else if (Array.isArray(fieldErrors)) {
        return fieldErrors.join(', ')
    }

    return undefined
}

const renderFileField = (
    config: UrlFileFieldProps['fileField'],
    form: FieldProps['form'],
    field: FieldProps['field'],
    uploadingState: [boolean, (v: boolean) => void],
    fileState: [File | null, (v: File | null) => void],
    fileInputRef: MutableRefObject<HTMLInputElement | null>
): JSX.Element => {
    const [uploading, setUploading] = uploadingState
    const [file, setFile] = fileState

    const deleteFile = () => {
        if (file) {
            setFile(null)
        }

        form.setFieldValue(field.name, null)
    }

    if (file || field.value) {
        return <div className={cx('file-field')}>
            <div className={cx('info')}>
                <div className={cx('name', {'uploading': uploading})}>
                    {uploading && <CircularProgress size={16} className={cx('icon', 'loader')}/>}
                    {!uploading && <Icon name='document' className={cx('icon', 'document')}/>}

                    <div className={cx('file-name')}>
                        {file && file.name || field.value.includes('pdf') && 'Файл загружен ✓' || 'Уже указана ссылка ✓'}
                    </div>
                </div>
                <IconClose onClick={deleteFile} className={cx('btn-delete', {disabled: uploading})}/>
            </div>
            {file && <div className={cx('status')}>
                {uploading && 'Идёт загрузка файла...' || 'Файл загружен'}
            </div>}
        </div>
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            const file: File = event.currentTarget.files[0]

            setFile(file)
            setUploading(true)

            const data = new FormData()
            data.append('file', file)

            api.Files.upload(data)
                .then(response => form.setFieldValue(field.name, response.url))
                .catch(() => setFile(null))
                .finally(() => setUploading(false))
        }
    }

    const error = formatErrors(form.errors, field.name)

    return <div className='mt-24'>
        <Button outlined content={config.uploadButtonLabel} onClick={() => fileInputRef.current?.click()}/>
        <TextCaption className={cx('mt-10 text-shade-60')}>{config.fileTypeText}</TextCaption>
        {!!error && <TextCaption className={cx('mt-10 text-red-900')}>{error}</TextCaption>}
        <input ref={fileInputRef} type='file' style={{display: 'none'}} onChange={onFileChange} accept={config.fileType}/>
    </div>
}

const renderUrlField = (
    config: UrlFileFieldProps['urlField'],
    form: FieldProps['form'],
    field: FieldProps['field']
): JSX.Element => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldValue(field.name, event.currentTarget.value)
    }

    return <TextField
        label='Ссылка'
        value={form.values[field.name]}
        errorText={formatErrors(form.errors, field.name)}
        onChange={onChange}
        endAdornment={(
            <InputAdornment position='end' className={cx('adornment-end')}>
                <Icon name='link'/>
            </InputAdornment>
        )}/>
}

const UrlFileField: React.FC<UrlFileFieldProps & FieldProps> = props => {
    const {urlField, fileField, form, field, defaultType} = props
    const [fieldType, setFieldType] = useState<UrlFileFieldType>(defaultType)
    const uploadingState = useState<boolean>(false)
    const fileState = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value === UrlFileFieldType.FILE) {
            setFieldType(UrlFileFieldType.FILE)
        } else {
            setFieldType(UrlFileFieldType.URL)
        }
    }

    const typeField = fieldType === UrlFileFieldType.FILE
        ? renderFileField(fileField, form, field, uploadingState, fileState, fileInputRef)
        : renderUrlField(urlField, form, field)

    return <>
        <Flex>
            <Radio label={urlField.label}
                   value={UrlFileFieldType.URL}
                   checked={fieldType === UrlFileFieldType.URL}
                   onChange={onChange}/>

            <Radio label={fileField.label}
                   value={UrlFileFieldType.FILE}
                   checked={fieldType === UrlFileFieldType.FILE}
                   onChange={onChange}/>
        </Flex>

        {typeField}
    </>
}

export default UrlFileField
