import React, {useEffect, useState} from 'react'
import {Form, Formik, Field} from 'formik'
import {observer} from 'mobx-react'
import * as Yup from 'yup'

import routes from 'routes'
import history from 'services/history'
import {useStores} from 'stores/MobxProvider'
import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import {useQuery} from 'common/utils/hooks'
import Loader from 'common/components/loader/Loader'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {maxString, object, requiredString} from 'common/utils/formValidation'
import FormTextArea from 'common/components/formItems/FormTextArea'

import {IFaq} from './interfaces/models'
import Grid from 'common/components/grid/Grid'

interface FormValues {
    question: string
    answer: string
}

const validationSchema: Yup.ObjectSchema = object({
    question: maxString(100).concat(requiredString()),
    answer: maxString(512).concat(requiredString())
})

const FaqDetails: React.FC = () => {
    const {faqList, fetching, fetchFaqList} = useStores().faqStore
    const [faq, setFaq] = useState<IFaq>()
    const [submitting, setSubmitting] = useState(false)

    const faqId = useQuery().get('faq_id')

    useEffect(() => {
        (async () => {
            if (faqId) {
                if (faqList.length) {
                    setFaq(faqList.find(faq => faq.id === faqId))
                } else {
                    await fetchFaqList()
                }
            }
        })()
    }, [faqList])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)
        try {
            if (faqId) {
                await api.Faq.update(faqId, values)
                notificationsStore.addSuccess(`Вопрос "${values.question}" успешно изменен`)
            } else {
                await api.Faq.create(values)
                notificationsStore.addSuccess(`Вопрос "${values.question}" успешно создан`)
            }

            history.push(routes.faq)
        } catch {
            setSubmitting(false)
        }
    }

    return <>
        <PageHeader>
            <PageBackButton title='все вопросы' onClick={() => history.push(routes.faq)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit} enableReinitialize initialValues={{
                question: faq?.question || '',
                answer: faq?.answer || ''
            }} validationSchema={validationSchema}>
                <Form>
                    <Field name='question' label='Вопрос' component={FormInput}/>

                    <Field name='answer' label='Ответ' component={FormTextArea} rows='10'/>

                    <Button className='mt-40'
                            type='submit'
                            content={faq && 'Сохранить изменения' || 'Создать вопрос'}
                            outlined
                            loading={submitting}
                            icon={!faq && 'plus' || undefined}/>
                </Form>

            </Formik>
        </Grid>
    </>
}

export default observer(FaqDetails)
