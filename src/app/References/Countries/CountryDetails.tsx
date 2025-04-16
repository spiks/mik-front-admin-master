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

import {ICountry} from './interfaces/models'

interface FormValues {
    name: string
    description: string
}

const CountryDetails: React.FC = () => {
    const countryId = useQuery().get('id')
    const [country, setCountry] = useState<ICountry>()
    const [fetching, setFetching] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        (async () => {
            if (countryId) {
                setFetching(true)

                try {
                    const response = await api.Countries.details(countryId)
                    setCountry(response.country)
                } finally {
                    setFetching(false)
                }
            }
        })()
    }, [countryId])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)

        try {
            if (countryId) {
                await api.Countries.update(countryId, values)
                notificationsStore.addSuccess('Изменения сохранены')
            } else {
                await api.Countries.create(values)
                notificationsStore.addSuccess('Страна добавлена в справочник')
            }

            history.push(routes.referencesCountries)
        } catch {
            setSubmitting(false)
        }
    }

    const getFormInitialValues = () => ({
        name: country?.name || '',
        description: country?.description || ''
    })

    const getFormValidationSchema = () => object({
        name: requiredString()
    })

    return <>
        <PageHeader>
            <PageBackButton title='справочники' onClick={() => history.push(routes.referencesCountries)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit}
                    enableReinitialize
                    initialValues={getFormInitialValues()}
                    validationSchema={getFormValidationSchema()}>
                <Form>
                    <Field name='name' label='Страна' component={FormInput}/>
                    <Field name='description' label='Описание' component={FormTextAreaWysiwyg}/>

                    <div>
                        <Button className='mt-40'
                                type='submit'
                                content={country && 'Сохранить изменения' || 'Добавить страну'}
                                loading={submitting}
                                icon={!country && 'plus' || undefined}/>
                    </div>
                </Form>
            </Formik>
        </Grid>
    </>
}

export default observer(CountryDetails)
