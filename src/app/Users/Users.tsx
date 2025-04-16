import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import routes from 'routes'

import PageHeader from 'common/components/layout/PageHeader'
import PageTitle from 'common/components/layout/PageTitle'
import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import SearchTextField from 'common/components/inputs/SearchTextField'
import CheckboxesGroup, {CheckboxGroupItem} from 'common/components/checkbox/CheckboxesGroup'
import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'

import {IUser, UserRole} from './interfaces/models'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import api from 'services/ApiService'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {TextBody} from 'common/components/text/Text'

const checkboxes: CheckboxGroupItem<UserRole>[] = [
    {
        label: 'Администраторы',
        value: UserRole.ADMIN
    },
    {
        label: 'Специалисты технической поддержки',
        value: UserRole.SUPPORT
    }
]

const Users: React.FC = () => {
    const {profile} = useStores().authStore

    const {users, totalCount, fetching, fetchUsers} = useStores().usersStore

    const [search, setSearch] = useState('')
    const [roles, setRoles] = useState<UserRole[]>([])

    useEffect(() => {
        (async () => await fetchUsers({search, roles}))()
    }, [roles, search])

    const formatUserRole = (user: IUser) => {
        switch (user.role) {
            case UserRole.ADMIN:
                return 'Администратор'
            case UserRole.SUPER_ADMIN:
                return 'Администратор (главный)'
            case UserRole.SUPPORT:
                return 'Специалист технической поддержки'
            default:
                return 'Неизвестная роль'
        }
    }

    const actionColumn = (user: IUser) => {
        return <ActionColumn
            onEditClick={profile?.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN && (() => {
                history.push(`${routes.userDetails}?user_id=${user.id}`)
            }) || undefined}
            onCloseClick={user.role !== UserRole.SUPER_ADMIN && (() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title={user.role === UserRole.ADMIN && 'Удалить администратора?' || 'Удалить специалиста технической поддержки?'}
                        onAccept={async () => {
                            await api.Users.delete(user.id)
                            notificationsStore.addSuccess(`Пользователь ${user.email} удален`)
                            await fetchUsers({search, roles})
                        }}
                    />,
                    withCross: false,
                    small: true
                })
            }) || undefined}
        />
    }

    const formatEmail = (user: IUser) => {
        if (profile?.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
            return <TextBody>
                <Link to={`${routes.userDetails}?user_id=${user.id}`}>{user.email}</Link>
            </TextBody>
        }

        return user.email
    }

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Пользователи' subtitle={`Всего специалистов: ${totalCount}`}/>
                <Button className='ml-24' icon='plus' content='Добавить пользователя' onClick={() => history.push(routes.userDetails)}/>
            </Flex>
            <SearchTextField onSetSearch={setSearch} placeholder='Найти пользователя по email'/>
        </PageHeader>

        {profile?.role === UserRole.SUPER_ADMIN &&
            <CheckboxesGroup title='Показывать пользователей:' values={checkboxes} checked={roles} onCheck={setRoles}/>
        }

        <Table className='mt-48' source={users} isLoading={fetching}>
            <Column width='296px' data={formatEmail}>Пользователь</Column>
            <Column width='360px' data={formatUserRole}>Роль в системе</Column>
            <Column cellClassName='justify-content-end' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Users)
