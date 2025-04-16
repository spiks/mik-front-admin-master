import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {FieldArray, Formik} from 'formik'
import {array} from 'yup'

import api from 'services/ApiService'

import {object, requiredString} from 'common/utils/formValidation'
import Grid from 'common/components/grid/Grid'
import Loader from 'common/components/loader/Loader'

import Items from './components/Items'

export interface IFormSupportTopic {
    id?: string
    name: string
    request_count: number
}

interface FormValues {
    topics: IFormSupportTopic[]
}

const SupportTopics: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [topics, setTopics] = useState<IFormSupportTopic[]>([])

    const fetchTopics = async () => {
        setFetching(true)

        try {
            const response = await api.SupportTopics.list()

            setTopics(response.topics)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchTopics())()
    }, [])

    const getInitialValues = () => ({topics})

    const getValidationSchema = () => object({
        topics: array().of(object({
            name: requiredString()
        }))
    })

    const onSubmit = (values: FormValues) => undefined

    if (fetching) return <Loader/>

    return <>
        <Grid templateColumns={'8fr 4fr'}>
            <Formik<FormValues> enableReinitialize
                                initialValues={getInitialValues()}
                                validationSchema={getValidationSchema}
                                onSubmit={onSubmit}>
                <FieldArray name='topics' component={Items}/>
            </Formik>
        </Grid>
    </>
}

export default observer(SupportTopics)
