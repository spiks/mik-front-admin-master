import React, {useRef, useState} from 'react'

import {TextH1} from 'common/components/text/Text'
import Button from 'common/components/button/Button'
import Icon from 'common/components/icon/Icon'
import modalStore from 'common/components/modal/ModalStore'

const cx = require('classnames/bind').bind(require('./styles/import-csv.scss'))

interface ImportModalProps {
    title: string
    confirmText: string
    onConfirm: (file: File) => Promise<boolean>
}

const ImportCsvModal: React.FC<ImportModalProps> = props => {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onButtonClick = () => {
        if (file) {
            setLoading(true)

            props
                .onConfirm(file)
                .then(result => {
                    setLoading(false)

                    if (result) {
                        modalStore.closeModal()
                    }
                })
                .catch(() => setLoading(false))
        }
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            setFile(event.currentTarget.files[0])
        }
    }

    const chooseFile = () => fileInputRef.current?.click()

    const deleteFile = () => setFile(null)

    return <div className={cx('wrapper')}>
        <TextH1>{props.title}</TextH1>

        <div className={cx('upload-area')}>
            {!file && <input ref={fileInputRef} type={'file'} onChange={onFileChange} accept='.csv'/>}
            {!file && <Button content='Выбрать файл' onClick={chooseFile}/>}

            {file && <div className={cx('file-info')}>
                <div className={cx('name')}>
                    <Icon name='document' className={cx('icon', 'document')}/>
                    {file.name}
                </div>
                <button type='button' onClick={deleteFile} className={cx('btn-delete')}>
                    <Icon name='close'/>
                </button>
            </div>}
        </div>

        {file && <Button content={props.confirmText} onClick={onButtonClick} loading={loading} className={cx('btn-confirm')}/>}
    </div>
}

export default ImportCsvModal