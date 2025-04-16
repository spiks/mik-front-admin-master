import React, {useEffect, useState} from 'react'
import {Form, Formik, Field} from 'formik'
import {observer} from 'mobx-react'

import routes from 'routes'

import history from 'services/history'
import api from 'services/ApiService'

import {useQuery} from 'common/utils/hooks'
import {object, requiredString, url} from 'common/utils/formValidation'
import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import UrlFileField, {UrlFileFieldType} from 'common/components/inputs/UrlFileField'
import Loader from 'common/components/loader/Loader'
import {TextBodyBold} from 'common/components/text/Text'
import Grid from 'common/components/grid/Grid'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'

import {IDocument} from './interfaces/models'

interface FormValues {
    name: string
    url: string
}

const DocumentDetails: React.FC = () => {
    const documentId = useQuery().get('id')
    const [document, setDocument] = useState<IDocument>()
    const [fetching, setFetching] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        (async () => {
            if (documentId) {
                setFetching(true)

                try {
                    const response = await api.Documents.details(documentId)
                    setDocument(response.document)
                } finally {
                    setFetching(false)
                }
            }
        })()
    }, [documentId])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)

        try {
            if (documentId) {
                await api.Documents.update(documentId, values)
                notificationsStore.addSuccess(`Документ "${values.name}" успешно изменен`)
            } else {
                await api.Documents.create(values)
                notificationsStore.addSuccess(`Документ "${values.name}" успешно создан`)
            }

            history.push(routes.referencesDocuments)
        } catch {
            setSubmitting(false)
        }
    }

    const getFormInitialValues = () => ({
        name: document?.name || '',
        url: document?.url || ''
    })

    const getFormValidationSchema = () => object({
        name: requiredString(),
        url: url.concat(requiredString())
    })

    return <>
        <PageHeader>
            <PageBackButton title='справочники' onClick={() => history.push(routes.referencesDocuments)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit}
                    enableReinitialize
                    initialValues={getFormInitialValues()}
                    validationSchema={getFormValidationSchema()}>
                <Form>
                    <Field name='name' label='Название документа' component={FormInput}/>

                    <TextBodyBold className='mt-24'>Тип документа</TextBodyBold>
                    <Field name='url'
                           component={UrlFileField}
                           disabled={!!documentId}
                           defaultType={document?.url?.split('.').pop() === 'pdf' ? UrlFileFieldType.FILE : UrlFileFieldType.URL}
                           fileField={{
                               label: 'PDF файл',
                               fileType: 'application/pdf',
                               fileTypeText: 'Только PDF файлы',
                               uploadButtonLabel: 'Загрузите документ'
                           }}
                           urlField={{
                               label: 'Ссылка на внешний ресурс'
                           }}/>

                    <Button className='mt-40'
                            type='submit'
                            content={document && 'Сохранить изменения' || 'Добавить документ'}
                            loading={submitting}
                            icon={!document && 'plus' || undefined}/>
                </Form>
            </Formik>
        </Grid>
    </>
}

export default observer(DocumentDetails)
