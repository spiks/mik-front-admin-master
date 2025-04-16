import React, {useState} from 'react'
import {Field, Form, Formik} from 'formik'

import api from 'services/ApiService'

import FormInput from 'common/components/formItems/FormInput'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import modalStore from 'common/components/modal/ModalStore'
import {TextH1} from 'common/components/text/Text'
import Container from 'common/components/container/Container'
import {object, requiredString, email} from 'common/utils/formValidation'

interface Props {
    initialEmail: string
}

const ResetPasswordModal: React.FC<Props> = ({initialEmail}) => {
    const [submitting, setSubmitting] = useState(false)

    const submit = async (values: {email: string}) => {
        setSubmitting(true)

        try {
            await api.Auth.resetPassword(values.email)

            notificationsStore.addSuccess('Ссылка для восстановления отправлена на вашу почту', 10)

            modalStore.closeModal()
        } catch {
            setSubmitting(false)
        }
    }

    return (
        <Container maxWidth='xs'>
            <TextH1>Восстановление пароля</TextH1>
            <div className='mt-8 mb-8 text-shade-60'>Укажите вашу почту, мы пришлём ссылку<br/>для восстановления пароля</div>
            <Formik<{email: string}> initialValues={{email: initialEmail}} validationSchema={object({email: requiredString().concat(email)})}
                                     onSubmit={submit}>
                <Form>
                    <Field label='Email' name='email' component={FormInput}/>
                    <Button className='mt-32' content='Отправить' type='submit' loading={submitting}/>
                </Form>
            </Formik>
        </Container>
    )
}

export default ResetPasswordModal
