import React, {useEffect, useState} from 'react'
import {FastField, Field, FieldArray, Form, Formik} from 'formik'

import history from 'services/history'
import routes from 'routes'
import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import FormImage from 'common/components/formItems/FormImage'
import Grid from 'common/components/grid/Grid'
import Button from 'common/components/button/Button'
import Flex from 'common/components/flex/Flex'
import {useQuery} from 'common/utils/hooks'
import Loader from 'common/components/loader/Loader'
import {TextBody, TextFootnote} from 'common/components/text/Text'
import {DATE_FORMAT_WITH_LOCALIZED_MONTH, formatDate} from 'common/utils/dates'
import ActionLink from 'common/components/link/ActionLink'
import modalStore from 'common/components/modal/ModalStore'
import UnpublishConfirmationModal from 'common/components/modal/UnpublishConfirmationModal'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import PublishConfirmationModal from 'common/components/modal/PublishConfirmationModal'

import {validationSchema} from './helpers/validation'
import {IStory} from './interfaces/stories'
import {getInitialValues, mapFormToRequestData, StoryFormValues} from './helpers/data'
import Frames from './components/Frames'
import FocusFormError from 'common/components/formItems/FocusFormError'

const StoryDetails: React.FC = () => {
    const [fetching, setFetching] = useState(false)
    const [story, setStory] = useState<IStory | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const fetchStory = async (storyId: string) => {
        setFetching(true)

        try {
            const res = await api.Stories.details(storyId)
            setStory(res.story)
        } finally {
            setFetching(false)
        }
    }

    const storyId = useQuery().get('story_id')

    useEffect(() => {
        if (storyId) {
            (async () => await fetchStory(storyId))()
        }
    }, [storyId])

    if (fetching) return <Loader/>

    const submit = async (values: StoryFormValues) => {
        setSubmitting(true)

        const data = mapFormToRequestData(values)

        try {
            if (storyId) {
                await api.Stories.update(storyId, data)
                notificationsStore.addSuccess(`История изменена`)
            } else {
                const res = await api.Stories.create(data)

                if (values.publish) {
                    await api.Stories.publish(res.story.id)
                    notificationsStore.addSuccess(`История сохранена и опубликована`)
                } else {
                    notificationsStore.addSuccess(`История сохранена в черновик`)
                }
            }

            history.push(routes.stories)
        } catch {
            setSubmitting(false)
        }
    }

    return <>
        <PageHeader>
            <PageBackButton title='все истории' onClick={() => history.push(routes.stories)}/>
        </PageHeader>

        <Grid templateColumns={'8fr 4fr'}>
            <Formik<StoryFormValues> enableReinitialize initialValues={getInitialValues(story)} validationSchema={validationSchema} onSubmit={submit}>
                {props => <Form>
                    <FocusFormError/>
                    <FastField name='title' required label='Заголовок истории' component={FormInput}/>
                    <Field name='image' className='mt-10' component={FormImage}
                           dropzoneProps={{buttonTitle: 'Изображение для главной'}}
                           previewProps={{width: '225px', height: '200px'}}
                           cropModalProps={{
                               title: 'Изображение на главную',
                               subtitle: `Выбранная область будет показываться\nна миниатюре истории на главной странице`,
                               aspectRatio: 144 / 128
                           }}
                    />

                    <FieldArray name='frames' component={Frames}/>

                    <Flex className='mt-56'>
                        {!storyId && <>
                            <Button content='Опубликовать' type='submit' loading={submitting} onClick={() => props.setFieldValue('publish', true)}/>
                            <Button content='Сохранить черновик' className='ml-8' text loading={submitting} type='submit'/>
                        </> || <Button content='Сохранить изменения' loading={submitting} type='submit'/>
                        }
                    </Flex>
                </Form>}
            </Formik>

            {story && (
                <div className='ml-24'>
                    <Flex column inline className='mt-12'>
                        <TextBody className='text-base1'>{story!.activated_at ? 'Опубликовано' : 'Черновик'}</TextBody>
                        <TextFootnote className='text-shade-40'>
                            {formatDate(story!.activated_at || story!.created_at, DATE_FORMAT_WITH_LOCALIZED_MONTH)}
                        </TextFootnote>
                        {story!.activated_at && <ActionLink
                            title='Снять с публикации' icon='close_small' red className='mt-8'
                            onClick={() => modalStore.openModal({
                                content: <UnpublishConfirmationModal
                                    title='Снять историю с публикации'
                                    content={`История переместится в «черновики»\nи не будет отображаться в приложении`}
                                    onAccept={async () => {
                                        await api.Stories.unpublish(story!.id)
                                        await fetchStory(story!.id)
                                        notificationsStore.addSuccess(`История снята с публикации`)
                                    }}
                                />,
                                small: true
                            })}
                        /> || <ActionLink
                            title='Опубликовать' icon='share' className='mt-8'
                            onClick={() => modalStore.openModal({
                                content: <PublishConfirmationModal
                                    title='Опубликовать историю'
                                    content={`История будет отображаться на главном \n экране приложения`}
                                    onAccept={async () => {
                                        await api.Stories.publish(story!.id)
                                        await fetchStory(story!.id)
                                        notificationsStore.addSuccess(`История опубликована`)
                                    }}
                                />,
                                small: true
                            })}
                        />
                        }
                    </Flex>
                </div>
            )}
        </Grid>
    </>
}

export default StoryDetails
