import * as Yup from 'yup'
import { FastField, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'

import Loader from 'common/components/loader/Loader'
import Button from 'common/components/button/Button'
import PageTitle from 'common/components/layout/PageTitle'
import PageHeader from 'common/components/layout/PageHeader'
import { minMaxString, object } from 'common/utils/formValidation'
import FormTextArea from 'common/components/formItems/FormTextArea'
import notificationsStore from 'common/components/notifications/NotificationsStore'

import api from 'services/ApiService'

import { IAbout } from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/about.scss'))
const maxAboutLength = 2000

const validationSchema: Yup.ObjectSchema = object({
  about: minMaxString(1, maxAboutLength)
})

const About: React.FC = () => {
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [about, setAbout] = useState<IAbout>({about: ''})

  useEffect(() => {
    (async () => {
      setFetching(true)

      try {
        const res = await api.About.get()

        if (res.about) {
          setAbout({about: res.about})
        }
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const submit = async (values: IAbout) => {
    setSubmitting(true)

    try {
      await api.About.update(values)
      notificationsStore.addSuccess('Тест сохранён')
    } catch (e) {
      notificationsStore.addError('Возникла проблема. Попробуйте снова.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader>
        <PageTitle title='О приложении'/>
      </PageHeader>

      <section className={cx('about-wrapper')}>
        {fetching
          ? <Loader absolute/>
          : <Formik initialValues={about}
                    enableReinitialize
                    onSubmit={() => undefined}
                    validationSchema={validationSchema}>
            {props =>
              <Form className={cx('about-wrapper-textArea')}>
                <FastField
                  className='mt-72'
                  name='about'
                  label='Текст'
                  rows={13}
                  component={FormTextArea}
                  helperText={`${props.values.about.length} / ${maxAboutLength}`}/>
                <Button
                  className='mt-40'
                  type='submit'
                  loading={submitting}
                  content={'Опубликовать'}
                  disabled={!props.dirty}
                  onClick={() => submit(props.values)}/>
              </Form>}
          </Formik>
        }
      </section>
    </>
  )
}

export default About