import React, {useState} from 'react'
import {Form, Formik, Field, FormikHelpers} from 'formik'
import {observer} from 'mobx-react'
import {Grid} from '@material-ui/core'

import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import FormInput from 'common/components/formItems/FormInput'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {equalPasswordText, isEqualWith, minString, object, password, requiredString} from 'common/utils/formValidation'
import Flex from 'common/components/flex/Flex'
import PageTitle from 'common/components/layout/PageTitle'
import {TextCaption} from 'common/components/text/Text'
import {errorHandler} from 'common/modules/ErrorHandler'
import * as Yup from 'yup'

interface FormValues {
    old_password: string
    new_password: string
    new_password_confirm: string
}

const ResetPassword: React.FC = () => {
    const [submitting, setSubmitting] = useState(false)

    const submit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
        setSubmitting(true)
        try {
            await api.Profile.changePassword(values)
            notificationsStore.addSuccess(`Пароль изменен`)
            helpers.resetForm()
        } catch (error) {
            if (error.response.data?.code === 'WrongAuthCredentials') {
                helpers.setFieldError('old_password', 'Неверный пароль')
            } else {
                errorHandler.showResponseError(error.response)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Смена пароля'/>
            </Flex>
        </PageHeader>

        <Formik onSubmit={submit}
                initialValues={{
                    old_password: '',
                    new_password: '',
                    new_password_confirm: ''
                }} validationSchema={object({
                    old_password: requiredString(),
                    new_password: password().concat(requiredString()).concat(Yup.string().nullable().min(6, () => 'Длина пароля должна быть больше 6 символов')),
                    new_password_confirm: requiredString().concat(isEqualWith('new_password', equalPasswordText))
                })
        }>
            {formikProps => <Form>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Field name='old_password' label='Старый пароль' type='password' component={FormInput}/>
                    </Grid>
                    <Grid item xs={8}/>

                    <Grid item xs={4}>
                        <Field name='new_password' label='Новый пароль' type='password' component={FormInput}/>
                    </Grid>
                    <Grid item xs={8}><TextCaption className='mt-32 text-shade-60'>минимум 6 символов</TextCaption></Grid>

                    <Grid item xs={4}>
                        <Field name='new_password_confirm' label='Подтвердите пароль' type='password' component={FormInput}/>
                    </Grid>
                    <Grid item xs={8}/>

                    <Grid item xs={4}>
                        <Button className='mt-40'
                                type='submit'
                                content='Сменить пароль'
                                loading={submitting}/>
                    </Grid>
                </Grid>
            </Form>}
        </Formik>
    </>
}

export default observer(ResetPassword)
