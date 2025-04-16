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
import {DATE_FORMAT_WITH_LOCALIZED_MONTH_SHORT, formatDate} from 'common/utils/dates'
import {TextBody} from 'common/components/text/Text'

import {IPostShort} from './interfaces/models'

const Posts: React.FC = () => {
    const {posts, totalCount, fetching, loadMore, fetchPosts} = useStores().postsStore
    const [search, setSearch] = useState('')

    useEffect(() => {
        (async () => await fetchPosts({search}))()
    }, [search])

    const formatPreview = (post: IPostShort) =>
        post.image ? <img className='object-fit-cover' alt='preview' src={post.image} width={80} height={80}/> : undefined

    const actionColumn = (post: IPostShort) => {
        return <ActionColumn
            onEditClick={() => {
                history.push(`${routes.postDetails}?post_id=${post.id}`)
            }}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить статью?'
                        content={`Статья будет полностью удалена,\nвы не сможете её редактировать`}
                        onAccept={async () => {
                            await api.Posts.delete(post.id)
                            notificationsStore.addSuccess(`Статья "${post.title}" удалена`)
                            await fetchPosts({search})
                        }}
                    />,
                    withCross: false,
                    small: true
                })
            }}
        />
    }

    const formatStatus = (post: IPostShort) => {
        let content

        if (post.published_at) {
            content = <ActionLinkWithStatus status='Опубликовано'>
                <ActionLink title='Снять с публикации' icon='close_small' red
                            onClick={() => {
                                modalStore.openModal({
                                    content: <UnpublishConfirmationModal
                                        title='Снять статью с публикации'
                                        content={`Статья переместится в «черновики»\nи не будет отображаться в приложении`}
                                        onAccept={async () => {
                                            await api.Posts.unpublish(post.id)
                                            notificationsStore.addSuccess(`Статья "${post.title}" снята с публикации`)
                                            await fetchPosts({search})
                                        }}
                                    />,
                                    withCross: false,
                                    small: true
                                })
                            }}/>
            </ActionLinkWithStatus>
        } else {
            content = <ActionLinkWithStatus status='Черновик'>
                <ActionLink title='Опубликовать' icon='share'
                            onClick={() => {
                                modalStore.openModal({
                                    content: <PublishConfirmationModal
                                        title='Опубликовать статью'
                                        content={`Статья будет отражаться на главном\nэкране и в разделе «все статьи»`}
                                        onAccept={async () => {
                                            await api.Posts.publish(post.id)
                                            notificationsStore.addSuccess(`Статья "${post.title}" опубликована`)
                                            await fetchPosts({search})
                                        }}
                                    />,
                                    withCross: false,
                                    small: true
                                })
                            }}/>
            </ActionLinkWithStatus>
        }

        return content
    }

    const formatPublishedAt = (post: IPostShort) =>
        post.published_at ? formatDate(post.published_at, DATE_FORMAT_WITH_LOCALIZED_MONTH_SHORT) : undefined

    const formatTitle = (post: IPostShort) => (
        <TextBody>
            <Link to={`${routes.postDetails}?post_id=${post.id}`}>{post.title}</Link>
        </TextBody>
    )

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Статьи' subtitle={`Всего статей: ${totalCount}`}/>
                <Button className='ml-24' icon='plus' content='Добавить статью' onClick={() => history.push(routes.postDetails)}/>
            </Flex>
            <SearchTextField onSetSearch={setSearch} placeholder='Поиск статьи по названию'/>
        </PageHeader>

        <Table className='mt-48' source={posts} isLoading={fetching} loadMore={loadMore}>
            <Column width='144px' data={formatPublishedAt}>Дата</Column>
            <Column width='120px' data={formatPreview}/>
            <Column width='400px' data={formatTitle}>Заголовок</Column>
            <Column width='204px' data={formatStatus}>Статус публикации</Column>
            <Column width='calc(100% - 868px)' cellClassName='justify-content-end' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Posts)
