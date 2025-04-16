import React, {useEffect} from 'react'
import {InputAdornment, IconButton} from '@material-ui/core'
import {Formik, Field, Form} from 'formik'

import history from 'services/history'

import FormInput from 'common/components/formItems/FormInput'
import {email, object, password, requiredString} from 'common/utils/formValidation'
import Button from 'common/components/button/Button'
import Flex from 'common/components/flex/Flex'
import Icon from 'common/components/icon/Icon'

import authStore from './stores/AuthStore'
import routes from '../../routes'
import modalStore from 'common/components/modal/ModalStore'
import ResetPasswordModal from './components/ResetPasswordModal'
import Container from 'common/components/container/Container'

const cx = require('classnames/bind').bind(require('./styles/auth.scss'))

export interface FieldsProps {
    email: string
    password: string
}

const Auth: React.FC = () => {
    const [submitting, setSubmitting] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    useEffect(() => {
        if (authStore.accessToken) {
            history.push(routes.main)
        }
    }, [])

    const handleSubmit = async (values: FieldsProps): Promise<void> => {
        setSubmitting(true)

        try {
            await authStore.login(values)
        } catch {
            setSubmitting(false)
        }
    }

    const openResetModal = (email: string) => {
        modalStore.openModal({content: <ResetPasswordModal initialEmail={email}/>})
    }

    return <Flex centered className={cx('auth-block')}>
        <Container className='text-center' maxWidth='xs'>
            <Flex justifyContentBetween alignItemsCenter className={cx('logos-wrapper')}>
                <Icon name='logo'/>
                <Icon name='doctor'/>
            </Flex>

            <Formik initialValues={{email: '', password: ''}} validationSchema={object({
                email: requiredString().concat(email),
                password: requiredString()
            })} onSubmit={handleSubmit}>
                {props => (
                    <Form>
                        <Field label='Логин' name='email' component={FormInput}/>
                        <Field name='password' label='Пароль' type={showPassword ? 'text' : 'password'} component={FormInput}
                               endAdornment={
                                   <InputAdornment position='end'>
                                       <IconButton
                                           aria-label='toggle password visibility'
                                           onClick={() => setShowPassword(!showPassword)}
                                       >
                                           <Icon name={showPassword && 'visibility_off' || 'visibility_on'}/>
                                       </IconButton>
                                   </InputAdornment>
                               }
                        />
                        <Flex column centered>
                            <Button className='mt-32' type='submit' content='Войти' loading={submitting}/>
                            <Button text className='mt-8' content='Восстановить пароль' onClick={() => openResetModal(props.values.email)}/>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Container>
    </Flex>
}

export default Auth
