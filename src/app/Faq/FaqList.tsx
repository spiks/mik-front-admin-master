import React, {useEffect} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import routes from 'routes'
import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import PageTitle from 'common/components/layout/PageTitle'
import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {TextBody} from 'common/components/text/Text'

import {IFaq} from './interfaces/models'

const FaqList: React.FC = () => {
    const {faqList, totalCount, fetching, fetchFaqList} = useStores().faqStore

    useEffect(() => {
        (async () => await fetchFaqList())()
    }, [])

    const actionColumn = (faq: IFaq) => {
        return <ActionColumn
            onEditClick={(() => {
                history.push(`${routes.faqDetails}?faq_id=${faq.id}`)
            })}
            onCloseClick={(() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить вопрос?'
                        onAccept={async () => {
                            await api.Faq.delete(faq.id)
                            notificationsStore.addSuccess(`Вопрос "${faq.question}" удален`)
                            await fetchFaqList()
                        }}
                    />,
                    withCross: false,
                    small: true
                })
            })}
        />
    }

    const formatQuestion = (faq: IFaq) => (
        <TextBody>
            <Link to={`${routes.faqDetails}?faq_id=${faq.id}`}>{faq.question}</Link>
        </TextBody>
    )

    const formatAnswer = (faq: IFaq) => <TextBody>{faq.answer}</TextBody>

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Часто задаваемые вопросы' subtitle={`Всего вопросов: ${totalCount}`}/>
                <Button className='ml-24' icon='plus' content='Добавить вопрос' onClick={() => history.push(routes.faqDetails)}/>
            </Flex>
        </PageHeader>

        <Table className='mt-48' source={faqList} isLoading={fetching}>
            <Column data={formatQuestion}>Вопрос</Column>
            <Column data={formatAnswer}>Ответ</Column>
            <Column width='100px' data={actionColumn}/>
        </Table>
    </>
}

export default observer(FaqList)
