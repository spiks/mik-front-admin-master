import * as React from 'react'
import {MobXProviderContext, Provider} from 'mobx-react'

import modalStore from 'common/components/modal/ModalStore'
import notificationsStore from 'common/components/notifications/NotificationsStore'

import authStore from 'app/Auth/stores/AuthStore'
import usersStore from 'app/Users/stores/UsersStore'
import storiesStore from 'app/Stories/stores/StoriesStore'
import faqStore from 'app/Faq/stores/FaqStore'
import postsStore from 'app/Posts/stores/PostsStore'
import vaccinationsStore from 'app/Vaccinations/stores/VaccinationsStore'
import supportStore from 'app/Support/stores/SupportStore'
import supportMessagesStore from 'app/Support/stores/SupportMessagesStore'

import globalStore from './GlobalStore'

const stores = {
    globalStore,
    authStore,
    modalStore,
    notificationsStore,
    usersStore,
    storiesStore,
    faqStore,
    postsStore,
    vaccinationsStore,
    supportStore,
    supportMessagesStore
}

export const useStores = () => {
    return React.useContext<typeof stores>(MobXProviderContext as any)
}

const MobxProvider: React.FC = props => {
    return (
        <Provider {...stores}>
            {props.children}
        </Provider>
    )
}

export default MobxProvider
