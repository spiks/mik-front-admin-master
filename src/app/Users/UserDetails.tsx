import React, {useEffect, useState} from 'react'
import {Form, Formik, Field} from 'formik'
import {observer} from 'mobx-react'

import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import api from 'services/ApiService'
import routes from 'routes'

import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import FormRadioGroup from 'common/components/formItems/FormRadioGroup'
import Radio from 'common/components/radio/Radio'
import {useQuery} from 'common/utils/hooks'
import Loader from 'common/components/loader/Loader'
import {TextBodyBold} from 'common/components/text/Text'
import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {email, object, requiredString} from 'common/utils/formValidation'

import {IUser, UserRole} from './interfaces/models'
import Grid from 'common/components/grid/Grid'

interface FormValues {
    email: string
    role: UserRole
}

const UserDetails: React.FC = () => {
    const {profile} = useStores().authStore
    const {users, fetching, fetchUsers} = useStores().usersStore
    const [user, setUser] = useState<IUser>()
    const [submitting, setSubmitting] = useState(false)

    const userId = useQuery().get('user_id')

    useEffect(() => {
        (async () => {
            if (userId) {
                if (users.length) {
                    setUser(users.find(user => user.id === userId))
                } else {
                    await fetchUsers()
                }
            }
        })()
    }, [userId, users])

    if (fetching) return <Loader/>

    const submit = async (values: FormValues) => {
        setSubmitting(true)
        try {
            if (userId) {
                await api.Users.update(userId, values.role)
                notificationsStore.addSuccess(`Пользователь "${values.email}" успешно изменен`)
            } else {
                await api.Users.create(values)
                notificationsStore.addSuccess(`Пользователь "${values.email}" успешно создан`)
            }

            history.push(routes.users)
        } catch {
            setSubmitting(false)
        }
    }

    return <>
        <PageHeader>
            <PageBackButton title='все пользователи' onClick={() => history.push(routes.users)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit} enableReinitialize initialValues={{
                email: user?.email || '',
                role: user?.role || UserRole.SUPPORT
            }} validationSchema={object({
                email: email.concat(requiredString())
            })}>
                <Form>
                    <Field name='email' disabled={!!user} label='Email (логин) пользователя' component={FormInput}/>

                    <TextBodyBold className='mt-24'>Роль пользователя в системе</TextBodyBold>
                    {profile?.role === UserRole.SUPER_ADMIN && (
                        <Field name='role' component={FormRadioGroup}>
                            <Flex>
                                <Radio label='Администратор' value={UserRole.ADMIN}/>
                                <Radio label='Специалист технической поддержки' value={UserRole.SUPPORT}/>
                            </Flex>
                        </Field>
                    ) || <div className='text-shade-60'>Специалист технической поддержки</div>}

                    <Button className='mt-40'
                            type='submit'
                            content={user && 'Сохранить изменения' || 'Создать пользователя'}
                            outlined
                            loading={submitting}
                            icon={!user && 'plus' || undefined}/>
                </Form>

            </Formik>
        </Grid>
    </>
}

export default observer(UserDetails)
