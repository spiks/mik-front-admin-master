import React, {useEffect, useState, useRef, useMemo} from 'react'
import {observer} from 'mobx-react'
import {Field, Form, Formik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {boolean, mixed} from 'yup'

import routes from 'routes'
import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import api from 'services/ApiService'
import globalStore from 'stores/GlobalStore'

import Flex from 'common/components/flex/Flex'
import PageHeader from 'common/components/layout/PageHeader'
import {DATE_FORMAT_WITHOUT_YEAR, formatDate, isAfterDate, TIME_FORMAT} from 'common/utils/dates'
import Icon from 'common/components/icon/Icon'
import PageBackButton from 'common/components/layout/PageBackButton'
import {useQuery} from 'common/utils/hooks'
import {TextBody, TextBodyBold, TextCaption} from 'common/components/text/Text'
import {maxString, object, requiredString} from 'common/utils/formValidation'
import FormTextArea from 'common/components/formItems/FormTextArea'
import Button from 'common/components/button/Button'
import Pagination from 'common/components/pagination/Pagination'
import Loader from 'common/components/loader/Loader'
import FormCheckbox from 'common/components/formItems/FormCheckbox'
import FormSelect from 'common/components/formItems/FormSelect'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import modalStore from 'common/components/modal/ModalStore'

import {ISupportMessage, SupportMessageAuthor} from './interfaces/models'
import {ISupportTopic} from '../References/SupportTopics/interfaces/models'
import UserInfoModal from './UserInfoModal'

const cx = require('classnames/bind').bind(require('./styles/support-messages.scss'))

interface FormValues {
    topic_id?: string
    same_topic: boolean
    message: string
}

const sessionStartedAt = new Date().toUTCString()

const SupportMessages: React.FC = () => {
    const {supportMessages, fetchMessages, loadMore} = useStores().supportMessagesStore
    const [topics, setTopics] = useState<ISupportTopic[]>([])
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [lastTopicId, setLastTopicId] = useState<string>()

    const requestId = useQuery().get('id')
    const chatRef = useRef<HTMLDivElement>(null)
    const chatHeightTrigger = 55

    const prevScrollHeight = useMemo(() => chatRef.current?.scrollHeight, [chatRef.current?.scrollHeight])

    useEffect(() => {
        if (prevScrollHeight && chatRef.current) {
            if ((chatRef.current.scrollHeight - prevScrollHeight) > chatHeightTrigger) {
                chatRef.current.scrollTop += chatRef.current.scrollHeight - prevScrollHeight
            }
        }
    }, [prevScrollHeight])

    useEffect(() => {
        (async () => {
            if (requestId) {
                setFetching(true)

                const res = await api.Support.details(requestId)
                await fetchMessages(res.request.id)
                setLastTopicId(res.last_topic?.id)

                const result = await api.SupportTopics.list()
                setTopics(result.topics)

                setFetching(false)

                chatRef.current?.lastElementChild?.scrollIntoView()

                const supportCheckResponse = await api.Support.check()
                globalStore.setHasUnreadSupportMessage(supportCheckResponse.status)
            }
        })()

        let delay = 5000
        let timeoutId = setTimeout(async function updateChat() {
            try {
                await fetchMessages()
                delay = 5000
            } catch {
                delay += 10000
            }

            timeoutId = setTimeout(updateChat, delay)
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [requestId])

    const submit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        const topic_id = values.same_topic ? lastTopicId : values.topic_id

        try {
            setSubmitting(true)

            if (requestId) {
                await api.SupportMessages.create(requestId, {...values, topic_id})
                await fetchMessages()

                setLastTopicId(topic_id)
                chatRef.current?.lastElementChild?.scrollIntoView({behavior: 'smooth'})
                actions.resetForm()

                notificationsStore.addSuccess('Сообщение успешно отправлено')
            }
        } catch (e) {
            if (e.response) {
                notificationsStore.addError('Возникла проблема. Попробуйте отправить сообщение снова.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const renderRows = (rows: ISupportMessage[]): JSX.Element[] => rows.map((item, index): JSX.Element => {
        const onUserClick = item.author === SupportMessageAuthor.USER && (() => {
            if (requestId) {
                modalStore.openModal({
                    content: <UserInfoModal requestId={requestId} messageId={item.id}/>,
                    className: cx('user-info-modal')
                })
            }
        }) || undefined

        return (
            <Flex className={cx('message')} key={index}>
                <Icon name='person' className={item.author === SupportMessageAuthor.SUPPORT ? 'path-primary-900' : 'path-shade-40'}
                      onClick={onUserClick}
                />
                <div className={cx('ml-16')}>
                    <Flex>
                        <TextBodyBold onClick={onUserClick} className={cx({pointer: onUserClick})}>
                            {item.author === SupportMessageAuthor.SUPPORT ? 'Техподдержка «Микроген»' : 'Клиент'}
                        </TextBodyBold>
                        {isAfterDate(item.created_at, sessionStartedAt) &&
                        <TextCaption uppercase className='text-primary-900 ml-8'>Новое</TextCaption>
                        }
                    </Flex>
                    <TextBody noLineClamp className={cx('text', 'mt-12', 'display-block')}>{item.message}</TextBody>
                </div>
                <Flex column alignItemsEnd className={cx('date', 'ml-32')}>
                    <TextBody className='text-shade-60'>{formatDate(item.created_at, DATE_FORMAT_WITHOUT_YEAR)}</TextBody>
                    <TextBody className='text-shade-60'>{formatDate(item.created_at, TIME_FORMAT)}</TextBody>
                </Flex>
            </Flex>
        )
    })

    if (fetching) return <Loader/>

    return <>
        <PageHeader>
            <PageBackButton title='все обращения' onClick={() => history.push(routes.support)}/>
        </PageHeader>

        <Flex justifyContentCenter>
            <div>
                <Flex alignItemsEnd className={cx('messages-wrap')}>
                    <div className={cx('fade')}/>
                    <div className={cx('messages')} ref={chatRef} id='chat'>
                        <Pagination reverse scrollable={() => document.getElementById('chat')!} loadMore={() => loadMore(requestId)}>
                            {renderRows(supportMessages)}
                        </Pagination>
                    </div>
                </Flex>
                <Formik onSubmit={submit} enableReinitialize initialValues={{
                    topic_id: undefined,
                    same_topic: false,
                    message: ''
                }} validationSchema={object({
                    message: maxString(1500).concat(requiredString()),
                    same_topic: boolean(),
                    topic_id: mixed().when(['same_topic'], {is: false, then: requiredString()})
                })}>
                    {formProps => (
                        <Form className={cx('form')}>
                            <Flex justifyContentBetween>
                                <Field name='topic_id'
                                       options={topics.map(item => ({label: item.name, value: item.id}))}
                                       label='Тема обращения'
                                       component={FormSelect}
                                       disabled={formProps.values.same_topic}
                                />
                                <Field label={<TextBodyBold className='text-base-1'>Ответ на вопрос по теме предыдущего сообщения</TextBodyBold>}
                                       name='same_topic'
                                       className={cx('mr-0 ml-18')}
                                       onChange={(e: any, checked: boolean) => {
                                           if (lastTopicId) {
                                               formProps.setFieldValue('topic_id', lastTopicId)
                                           }

                                           formProps.setFieldValue('same_topic', checked)
                                       }}
                                       component={FormCheckbox}
                                       disabled={!lastTopicId}
                                />
                            </Flex>
                            <Field className='mt-24' label='Ваш ответ' name='message' component={FormTextArea} rows='5'/>

                            <Flex alignItemsCenter
                                  justifyContentBetween={!formProps.dirty || !formProps.isValid}
                                  justifyContentEnd={formProps.dirty && formProps.isValid}
                                  className='mt-28'
                            >
                                {(!formProps.dirty || !formProps.isValid) &&
                                <TextBody className='text-red-900'>Перед тем как ответить, выберите тему обращения пользователя</TextBody>
                                }
                                <Button type='submit' content='Отправить' loading={submitting} disabled={!formProps.dirty || !formProps.isValid}/>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </div>
        </Flex>
    </>
}

export default observer(SupportMessages)
