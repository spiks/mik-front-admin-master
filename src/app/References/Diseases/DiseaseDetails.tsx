import React, {useEffect, useState} from 'react'
import {Form, Formik, Field} from 'formik'
import {observer} from 'mobx-react'

import routes from 'routes'

import history from 'services/history'
import api from 'services/ApiService'

import {useQuery} from 'common/utils/hooks'
import {object, requiredString} from 'common/utils/formValidation'
import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import FormCheckbox from 'common/components/formItems/FormCheckbox'
import Loader from 'common/components/loader/Loader'
import Grid from 'common/components/grid/Grid'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import FormTextAreaWysiwyg from 'common/components/formItems/FormTextAreaWysiwyg'

import {IDisease} from './interfaces/models'

interface FormValues {
    name: string
    description: string
    risk: boolean
}

const DiseaseDetails: React.FC = () => {
    const diseaseId = useQuery().get('id')
    const [disease, setDisease] = useState<IDisease>()
    const [fetching, setFetching] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        (async () => {
            if (diseaseId) {
                setFetching(true)

                try {
                    const response = await api.Diseases.details(diseaseId)
                    setDisease(response.disease)
                } finally {
                    setFetching(false)
                }
            }
        })()
    }, [diseaseId])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)

        try {
            if (diseaseId) {
                await api.Diseases.update(diseaseId, values)
                notificationsStore.addSuccess('Изменения сохранены')
            } else {
                await api.Diseases.create([values])
                notificationsStore.addSuccess('Заболевание добавлено в справочник')
            }

            history.push(routes.referencesDiseases)
        } catch {
            setSubmitting(false)
        }
    }

    const getFormInitialValues = () => ({
        name: disease?.name || '',
        description: disease?.description || '',
        risk: disease?.risk || false
    })

    const getFormValidationSchema = () => object({
        name: requiredString(),
        description: requiredString()
    })

    return <>
        <PageHeader>
            <PageBackButton title='справочники' onClick={() => history.push(routes.referencesDiseases)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit}
                    enableReinitialize
                    initialValues={getFormInitialValues()}
                    validationSchema={getFormValidationSchema()}>
                <Form>
                    <Field name='name' label='Название заболевания' component={FormInput}/>
                    <Field name='description' label='Описание заболевания' required component={FormTextAreaWysiwyg}/>
                    <Field name='risk' label='У заболевания есть группа риска' component={FormCheckbox}/>

                    <div>
                        <Button className='mt-40'
                                type='submit'
                                content={disease && 'Сохранить изменения' || 'Добавить заболевание'}
                                loading={submitting}
                                icon={!disease && 'plus' || undefined}/>
                    </div>
                </Form>
            </Formik>
        </Grid>
    </>
}

export default observer(DiseaseDetails)
