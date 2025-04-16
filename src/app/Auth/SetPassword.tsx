import React from 'react'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

import api from 'services/ApiService'
import history from 'services/history'

import Container from 'common/components/container/Container'
import Flex from 'common/components/flex/Flex'
import Icon from 'common/components/icon/Icon'
import {object, password, requiredString} from 'common/utils/formValidation'
import FormInput from 'common/components/formItems/FormInput'
import Button from 'common/components/button/Button'
import {useQuery} from 'common/utils/hooks'

import routes from '../../routes'

const cx = require('classnames/bind').bind(require('./styles/auth.scss'))

interface FieldsProps {
    password: string
    repeatPassword: string
}

const SetPassword: React.FC = () => {
    const [submitting, setSubmitting] = React.useState(false)

    const reset_id = useQuery().get('reset_id')

    if (!reset_id) {
        return <div>Невалидная ссылка</div>
    }

    const handleSubmit = async (values: FieldsProps): Promise<void> => {
        setSubmitting(true)

        try {
            await api.Auth.setPassword({password: values.password, reset_id})

            history.replace(routes.auth)
        } catch {
            setSubmitting(false)
        }
    }

    return (
        <Flex centered className={cx('auth-block')}>
            <Container className='text-center' maxWidth='xs'>
                <Flex justifyContentBetween alignItemsCenter className={cx('logos-wrapper')}>
                    <div className='text-shade-60'>Введите новый пароль<br/>для входа в систему</div>
                    <Icon name='doctor'/>
                </Flex>

                <Formik<FieldsProps> initialValues={{repeatPassword: '', password: ''}} validationSchema={object({
                    password: password().concat(requiredString()),
                    repeatPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
                        .required('Пароли должны совпадать')
                })} onSubmit={handleSubmit}>
                    {props => (
                        <Form>
                            <Field label='Новый пароль' name='password' type='password' component={FormInput}/>
                            <Field label='Повторите пароль' name='repeatPassword' type='password' component={FormInput}/>
                            <Flex column centered>
                                <Button className='mt-32' type='submit' content='Сменить пароль' loading={submitting}/>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Container>
        </Flex>
    )
}

export default SetPassword
