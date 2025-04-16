import React, {useEffect} from 'react'
import {observer} from 'mobx-react'

import routes from 'routes'

import {useStores} from 'stores/MobxProvider'
import history from 'services/history'

import Flex from 'common/components/flex/Flex'
import PageTitle from 'common/components/layout/PageTitle'
import PageHeader from 'common/components/layout/PageHeader'
import Column from 'common/components/table/Column'
import Table from 'common/components/table/Table'
import {DATE_FORMAT_WITH_LOCALIZED_MONTH, formatDate} from 'common/utils/dates'
import Icon from 'common/components/icon/Icon'
import Badge from 'common/components/badge/Badge'
import {TextBody} from 'common/components/text/Text'

import {ISupport} from './interfaces/models'

const Support: React.FC = () => {
    const {supportList, totalCount, fetching, loadMore, fetchSupportList} = useStores().supportStore

    useEffect(() => {
        (async () => await fetchSupportList())()
    }, [])

    const formatCounter = (item: ISupport) => item.has_answer ? <Icon name='check'/> : <Badge quantity={item.unread_messages}/>

    const formatMessage = (item: ISupport) => <TextBody ellipsis>{item.last_message}</TextBody>

    const formatCreatedAt = (item: ISupport) => formatDate(item.created_at, DATE_FORMAT_WITH_LOCALIZED_MONTH)

    const rowClick = (item: ISupport) => history.push(`${routes.supportMessages}?id=${item.id}`)

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Темы обращений' subtitle={`Всего обращений: ${totalCount}`}/>
            </Flex>
        </PageHeader>

        <Table className='mt-48' source={supportList} isLoading={fetching} loadMore={loadMore} onClickRow={rowClick}>
            <Column cellClassName='justify-content-center' width='104px' data={formatCounter}>Сообщ.</Column>
            <Column width='184px' data={formatCreatedAt}>Дата обращения</Column>
            <Column width='680px' data={formatMessage}>Сообщение</Column>
        </Table>
    </>
}

export default observer(Support)
