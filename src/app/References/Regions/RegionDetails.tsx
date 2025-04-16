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
import FormTextAreaWysiwyg from 'common/components/formItems/FormTextAreaWysiwyg'
import Loader from 'common/components/loader/Loader'
import Grid from 'common/components/grid/Grid'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'

import {IRegion} from './interfaces/models'

interface FormValues {
    name: string
    description: string
}

const RegionDetails: React.FC = () => {
    const regionId = useQuery().get('id')
    const [region, setRegion] = useState<IRegion>()
    const [fetching, setFetching] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        (async () => {
            if (regionId) {
                setFetching(true)

                try {
                    const response = await api.Regions.details(regionId)
                    setRegion(response.region)
                } finally {
                    setFetching(false)
                }
            }
        })()
    }, [regionId])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)

        try {
            if (regionId) {
                await api.Regions.update(regionId, values)
                notificationsStore.addSuccess('Изменения сохранены')
            } else {
                await api.Regions.create(values)
                notificationsStore.addSuccess('Регион проживания добавлен в справочник')
            }

            history.push(routes.referencesRegions)
        } catch {
            setSubmitting(false)
        }
    }

    const getFormInitialValues = () => ({
        name: region?.name || '',
        description: region?.description || ''
    })

    const getFormValidationSchema = () => object({
        name: requiredString()
    })

    return <>
        <PageHeader>
            <PageBackButton title='справочники' onClick={() => history.push(routes.referencesRegions)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit}
                    enableReinitialize
                    initialValues={getFormInitialValues()}
                    validationSchema={getFormValidationSchema()}>
                <Form>
                    <Field name='name' label='Регион проживания' component={FormInput}/>
                    <Field name='description' label='Описание' component={FormTextAreaWysiwyg}/>

                    <div>
                        <Button className='mt-40'
                                type='submit'
                                content={region && 'Сохранить изменения' || 'Добавить регион проживания'}
                                loading={submitting}
                                icon={!region && 'plus' || undefined}/>
                    </div>
                </Form>
            </Formik>
        </Grid>
    </>
}

export default observer(RegionDetails)
