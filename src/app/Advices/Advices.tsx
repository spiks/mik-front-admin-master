import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import * as Yup from 'yup'
import {FieldArray, Form, Formik} from 'formik'

import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import PageTitle from 'common/components/layout/PageTitle'
import Flex from 'common/components/flex/Flex'
import Loader from 'common/components/loader/Loader'
import {object, requiredString, maxString} from 'common/utils/formValidation'
import SearchTextField from 'common/components/inputs/SearchTextField'

import AdvicesList from './AdvicesList'
import {IAdvice} from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/advices.scss'))

const validationSchema: Yup.ObjectSchema = object({
    advices: Yup.array().of(object<{text: string | null}>({
        text: maxString(130).concat(requiredString())
    }))
})

const Advices: React.FC = () => {
    const [search, setSearch] = useState('')
    const [fetching, setFetching] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [advices, setAdvices] = useState<IAdvice[]>([])

    useEffect(() => {
        (async () => {
            setFetching(true)

            try {
                const res = await api.Advices.list({search: search || undefined})

                setAdvices(res.advices)
                setTotalCount(res.advices.length)
            } finally {
                setFetching(false)
            }
        })()
    }, [search])

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Советы персонажа' subtitle={`Всего советов: ${totalCount}`}/>
            </Flex>
            <SearchTextField onSetSearch={setSearch} placeholder='Найти советы по ключевым словам'/>
        </PageHeader>

        <section className={cx('advices-wrapper')}>
            {fetching
                ? <Loader absolute />
                : <Formik initialValues={{advices}}
                        enableReinitialize
                        onSubmit={() => undefined}
                        validationSchema={validationSchema}>
                    <Form>
                        <FieldArray name='advices' component={AdvicesList}/>
                    </Form>
                </Formik>
            }
        </section>
    </>
}

export default observer(Advices)
