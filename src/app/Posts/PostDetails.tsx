import React, {useEffect, useState} from 'react'
import {Form, Formik, Field} from 'formik'
import * as Yup from 'yup'

import history from 'services/history'
import api from 'services/ApiService'
import routes from 'routes'

import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import FormInput from 'common/components/formItems/FormInput'
import FormImage from 'common/components/formItems/FormImage'
import {useQuery} from 'common/utils/hooks'
import Loader from 'common/components/loader/Loader'
import {TextBody, TextFootnote} from 'common/components/text/Text'
import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {maxString, object, requiredString, url} from 'common/utils/formValidation'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import {DATE_FORMAT_WITH_LOCALIZED_MONTH, formatDate} from 'common/utils/dates'
import Grid from 'common/components/grid/Grid'
import ActionLink from 'common/components/link/ActionLink'
import UnpublishConfirmationModal from 'common/components/modal/UnpublishConfirmationModal'
import FocusFormError from 'common/components/formItems/FocusFormError'
import FormTextAreaWysiwyg from 'common/components/formItems/FormTextAreaWysiwyg'

import {IPost, PostCreateRequest} from './interfaces/models'
import {validate} from './helpers/validation'

export interface PostFormValues {
    title: string
    image: string
    content: string
    link: string
    publish: boolean
}

const validationSchema: Yup.ObjectSchema = object({
    title: maxString(90).concat(requiredString()),
    link: url,
    image: requiredString().nullable()
})

const PostDetails: React.FC = () => {
    const [post, setPost] = useState<IPost>()
    const [submitting, setSubmitting] = useState(false)
    const [fetching, setFetching] = useState(false)

    const fetchPost = async (postId: string) => {
        setFetching(true)

        try {
            const res = await api.Posts.details(postId)

            setPost(res.post)
        } finally {
            setFetching(false)
        }
    }

    const postId = useQuery().get('post_id')

    useEffect(() => {
        if (postId) {
            (async () => await fetchPost(postId))()
        }
    }, [postId])

    if (fetching) return <Loader/>

    const submit = async (values: PostFormValues) => {
        setSubmitting(true)

        const data: PostCreateRequest = {
            title: values.title,
            image: values.image,
            content: values.content,
            link: values.link
        }

        try {
            if (postId) {
                await api.Posts.update(postId, {...data, link: values.link || undefined})
                notificationsStore.addSuccess(`Изменения сохранены`)
            } else {
                const res = await api.Posts.create({...data, link: values.link || undefined})

                if (values.publish) {
                    await api.Posts.publish(res.post.id)
                    notificationsStore.addSuccess(`Статья ${values.title} успешно создана и опубликована`)
                } else {
                    notificationsStore.addSuccess(`Статья ${values.title} успешно создана`)
                }
            }

            history.push(routes.posts)
        } catch {
            setSubmitting(false)
        }
    }

    return <>
        <PageHeader>
            <PageBackButton title='все статьи' onClick={() => history.push(routes.posts)}/>
        </PageHeader>

        <Grid templateColumns='8fr 4fr'>
            <Formik onSubmit={submit} enableReinitialize validate={validate} initialValues={{
                title: post?.title || '',
                image: post?.image || '',
                content: post?.content || '',
                link: post?.link || '',
                publish: !!post?.published_at || false
            }} validationSchema={validationSchema}>
                {formProps => <Form>
                    <FocusFormError/>
                    <Field name='title' required label='Заголовок' component={FormInput}/>
                    <Field name='image' className='mt-16 mb-16' component={FormImage}
                           dropzoneProps={{buttonTitle: 'Фотография'}}
                           previewProps={{width: '480px', height: '270px'}}
                           cropModalProps={{
                               title: 'Фотография',
                               aspectRatio: 16 / 9
                           }}
                    />
                    <Field name='content' required label='Текст статьи' component={FormTextAreaWysiwyg}/>
                    <Field name='link' label='Ссылка на внешний источник' component={FormInput}/>

                    <Flex>
                        <Button className='mt-40 mr-8'
                                type='submit'
                                content={post?.published_at && 'Сохранить' || 'Опубликовать'}
                                loading={submitting}
                                onClick={() => formProps.setFieldValue('publish', true)}/>
                        {!post?.published_at &&
                        <Button className='mt-40'
                                type='submit'
                                content='Сохранить черновик'
                                text
                                loading={submitting}
                                disabled={!formProps.dirty}/>
                        }
                        {post?.published_at &&
                        <Button className='mt-40' type='button' content='Удалить статью' text red loading={fetching} disabled={submitting}
                                onClick={() => {
                                    modalStore.openModal({
                                        content: <DeleteConfirmationModal
                                            title='Удалить статью?'
                                            content={`Статья будет полностью удалена,\nвы не сможете её редактировать`}
                                            onAccept={async () => {
                                                await api.Posts.delete(post.id)
                                                history.push(routes.posts)
                                                notificationsStore.addSuccess(`Статья "${post.title}" удалена`)
                                            }}
                                        />,
                                        withCross: false,
                                        small: true
                                    })
                                }}
                        />
                        }
                    </Flex>
                </Form>}
            </Formik>
            {post && <div className='ml-24'>
                <Flex column inline className='mt-12'>
                    <TextBody className='text-base1'>{post.published_at ? 'Опубликовано' : 'Черновик'}</TextBody>
                    <TextFootnote className='text-shade-40'>
                        {formatDate(post.published_at || post.created_at, DATE_FORMAT_WITH_LOCALIZED_MONTH)}
                    </TextFootnote>
                    {post.published_at &&
                    <ActionLink
                        title='Снять с публикации' icon='close_small' red className='mt-8'
                        onClick={() => {
                            modalStore.openModal({
                                content: <UnpublishConfirmationModal
                                    title='Снять статью с публикации'
                                    content={`Статья переместится в «черновики»\nи не будет отображаться в приложении`}
                                    onAccept={async () => {
                                        await api.Posts.unpublish(post!.id)
                                        await fetchPost(post!.id)
                                        notificationsStore.addSuccess(`Статья снята с публикации`)
                                    }}
                                />,
                                withCross: false,
                                small: true
                            })
                        }}
                    />
                    }
                </Flex>
            </div>}
        </Grid>
    </>
}

export default PostDetails
