import React, {useEffect} from 'react'
import Drawer from '@material-ui/core/Drawer'
import {Link, NavLink} from 'react-router-dom'
import {observer} from 'mobx-react'

import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import routes from 'routes'
import api from 'services/ApiService'

import Icon from 'common/components/icon/Icon'
import Flex from 'common/components/flex/Flex'
import {TextBody, TextFootnote} from 'common/components/text/Text'
import Avatar from 'common/components/avatar/Avatar'
import modalStore from 'common/components/modal/ModalStore'
import ConfirmationModal from 'common/components/modal/ConfirmationModal'
import Badge from 'common/components/badge/Badge'

import SidebarLink from 'app/App/SidebarLink'

import authStore from '../Auth/stores/AuthStore'
import {UserRole} from '../Users/interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/layout.scss'))

const baseDelay: number = 60000

const SideBar: React.FC = () => {
    const {profile} = useStores().authStore
    const {hasUnreadSupportMessage, setHasUnreadSupportMessage} = useStores().globalStore

    const logout = () => {
        modalStore.openModal({
            content: <ConfirmationModal
                title='Выход из системы'
                acceptButtonText='Выйти'
                cancelButtonText='Отмена'
                redButtons
                onAccept={async () => {
                    authStore.reset()
                    history.push(routes.auth)
                }}
            />,
            small: true
        })
    }

    useEffect(() => {
        let delay = baseDelay

        let timeoutId = setTimeout(async function updateStatus() {
            try {
                const result = await api.Support.check()

                if (result) {
                    setHasUnreadSupportMessage(result.status)
                }

                delay = baseDelay
            } catch {
                delay += 10000
            } finally {
                timeoutId = setTimeout(updateStatus, delay)
            }
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <Drawer className={cx('sidebar')} classes={{paper: cx('sidebar-paper')}} variant='permanent' anchor='left'>
            <Link className='mb-36' to={routes.main}><Icon name='logo'/></Link>

            {profile?.role === UserRole.SUPPORT && (
                <SidebarLink to={routes.support}>Обратная связь</SidebarLink>
            ) || <>
                <SidebarLink to={routes.stories}>Истории</SidebarLink>
                <SidebarLink to={routes.posts}>Статьи</SidebarLink>
                <SidebarLink to={routes.vaccinations}>Вакцинации</SidebarLink>
                <SidebarLink to={routes.references} exact={false}>Справочники</SidebarLink>
                <SidebarLink to={routes.advices}>Советы персонажа</SidebarLink>
                <SidebarLink to={routes.support}>
                    <Flex alignItemsCenter>Обратная связь{hasUnreadSupportMessage ? <Badge className='ml-12' small/> : undefined}</Flex>
                </SidebarLink>
                <SidebarLink to={routes.faq}>F.A.Q.</SidebarLink>
                <SidebarLink to={routes.users}>Список пользователей</SidebarLink>
                <SidebarLink to={routes.about}>О приложении</SidebarLink>
            </>}

            <Flex className={cx('logout')} alignItemsCenter>
                <Avatar><Icon name='person'/></Avatar>
                <div className='ml-8'>
                    <TextBody className={cx('username')}>{profile?.email}</TextBody>
                    <TextFootnote className='text-shade-40'>
                        <NavLink className={cx('footer-action')}
                                 activeClassName={cx('footer-action-active')}
                                 to={routes.resetPassword}>Сменить пароль</NavLink> | <span className='pointer' onClick={logout}>Выйти</span>
                    </TextFootnote>
                </div>
            </Flex>
        </Drawer>
    )
}

export default observer(SideBar)
