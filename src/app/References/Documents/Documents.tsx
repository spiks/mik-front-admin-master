import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'

import history from 'services/history'
import routes from 'routes'

import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'

import {IDocument} from './interfaces/models'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import api from 'services/ApiService'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import Button from 'common/components/button/Button'
import Icon from 'common/components/icon/Icon'
import {ICountryShort} from '../Countries/interfaces/models'
import {TextBody} from 'common/components/text/Text'
import {Link} from 'react-router-dom'

const Documents: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [documents, setDocuments] = useState<IDocument[]>([])

    const fetchDocuments = async () => {
        setFetching(true)

        try {
            const response = await api.Documents.list()
            setDocuments(response.documents)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchDocuments())()
    }, [])

    const actionColumn = (document: IDocument) => {
        return <ActionColumn
            onEditClick={() => history.push(`${routes.referencesDocumentDetails}?id=${document.id}`)}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить документ?'
                        onAccept={async () => {
                            await api.Documents.delete(document.id)
                            notificationsStore.addSuccess(`Документ "${document.name}" удален`)
                            await fetchDocuments()
                        }}
                    />,
                    small: true
                })
            }}
        />
    }

    const formatDocumentType = (document: IDocument): JSX.Element => {
        if (document.url.split('.').pop() === 'pdf') {
            return <><Icon name='document' className='mr-10'/> Документ PDF</>
        }

        return <><Icon name='link' className='mr-10'/> Ссылка на внешний ресурс</>
    }

    const formatName = (document: IDocument) => (
        <TextBody>
            <Link to={`${routes.referencesDocumentDetails}?id=${document.id}`}>{document.name}</Link>
        </TextBody>
    )

    return <>
        <Button icon='plus' content='Добавить документ' onClick={() => history.push(routes.referencesDocumentDetails)}/>

        <Table className='mt-50' source={documents} isLoading={fetching}>
            <Column data={formatDocumentType} width='280px'>Тип документа</Column>
            <Column data={formatName}>Название документа</Column>
            <Column width='100px' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Documents)
