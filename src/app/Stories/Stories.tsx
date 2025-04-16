import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import api from 'services/ApiService'
import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import routes from 'routes'

import Flex from 'common/components/flex/Flex'
import PageTitle from 'common/components/layout/PageTitle'
import Button from 'common/components/button/Button'
import SearchTextField from 'common/components/inputs/SearchTextField'
import PageHeader from 'common/components/layout/PageHeader'
import Column from 'common/components/table/Column'
import Table from 'common/components/table/Table'
import ActionColumn from 'common/components/table/components/ActionColumn'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import ActionLink from 'common/components/link/ActionLink'
import ActionLinkWithStatus from 'common/components/link/ActionLinkWithStatus'
import UnpublishConfirmationModal from 'common/components/modal/UnpublishConfirmationModal'
import PublishConfirmationModal from 'common/components/modal/PublishConfirmationModal'
import {TextBody} from 'common/components/text/Text'

import {IStoryShort} from './interfaces/stories'

const Stories: React.FC = () => {
    const {stories, totalCount, fetching, loadMore, refreshList} = useStores().storiesStore
    const [search, setSearch] = useState('')

    useEffect(() => {
        (async () => await refreshList({search}))()
    }, [search])

    const formatPreview = (story: IStoryShort) => <img className='object-fit-cover' alt='preview' src={story.image} width={80} height={80}/>

    const actionColumn = (story: IStoryShort) => {
        return <ActionColumn
            onEditClick={() => {
                history.push(`${routes.storyDetails}?story_id=${story.id}`)
            }}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить историю?'
                        content={`История будет полностью удалена,\nвы не сможете ее редактировать.`}
                        onAccept={async () => {
                            await api.Stories.delete(story.id)
                            notificationsStore.addSuccess(`История удалена`)
                            await refreshList({search})
                        }}
                    />,
                    withCross: false,
                    small: true
                })
            }}
        />
    }

    const formatStatus = (story: IStoryShort) => {
        let content

        if (story.activated_at) {
            content = <ActionLinkWithStatus status='Опубликовано'>
                <ActionLink title='Снять с публикации' icon='close_small' red onClick={() => modalStore.openModal({
                    content: <UnpublishConfirmationModal
                        title='Снять историю с публикации'
                        content={`История переместится в «черновики»\nи не будет отображаться в приложении`}
                        onAccept={async () => {
                            await api.Stories.unpublish(story!.id)
                            notificationsStore.addSuccess('История снята с публикации')
                            await refreshList({search})
                        }}
                    />,
                    small: true
                })}/>
            </ActionLinkWithStatus>
        } else {
            content = <ActionLinkWithStatus status='Черновик'>
                <ActionLink title='Опубликовать' icon='share' onClick={() => modalStore.openModal({
                    content: <PublishConfirmationModal
                        title='Опубликовать историю'
                        content={`История будет отображаться на главном \n экране приложения`}
                        onAccept={async () => {
                            await api.Stories.publish(story!.id)
                            notificationsStore.addSuccess('История опубликована')
                            await refreshList({search})
                        }}
                    />,
                    small: true
                })}/>
            </ActionLinkWithStatus>
        }

        return content
    }

    const formatTitle = (story: IStoryShort) => (
        <TextBody>
            <Link to={`${routes.storyDetails}?story_id=${story.id}`}>{story.title}</Link>
        </TextBody>
    )

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Истории' subtitle={`Всего историй: ${totalCount}`}/>
                <Button className='ml-24' icon='plus' content='Добавить историю' onClick={() => history.push(routes.storyDetails)}/>
            </Flex>
            <SearchTextField onSetSearch={setSearch} placeholder='Найти историю по заголовку'/>
        </PageHeader>

        <Table className='mt-48' source={stories} isLoading={fetching} loadMore={loadMore}>
            <Column width='120px' data={formatPreview}>Картинка</Column>
            <Column width='304px' data={formatTitle}>Заголовок</Column>
            <Column width='204px' data={formatStatus}>Статус публикации</Column>
            <Column cellClassName='justify-content-end' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Stories)
