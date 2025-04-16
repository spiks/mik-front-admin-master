import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {FieldArray, Formik} from 'formik'
import {array} from 'yup'

import api from 'services/ApiService'

import {object, requiredString} from 'common/utils/formValidation'
import Grid from 'common/components/grid/Grid'
import Loader from 'common/components/loader/Loader'

import Items from './components/Items'

const cx = require('classnames/bind').bind(require('./styles/list.scss'))

export interface IFormActivity {
    id?: string
    name: string
}

interface FormValues {
    activities: IFormActivity[]
}

const Activities: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [activities, setActivities] = useState<IFormActivity[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)

    const fetchActivities = async () => {
        setFetching(true)

        try {
            const response = await api.Activities.list()

            setActivities(response.activities)
            setTotalCount(response.activities.length)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchActivities())()
    }, [])

    const getInitialValues = () => ({activities})

    const getValidationSchema = () => object({
        activities: array().of(object({
            name: requiredString()
        }))
    })

    const onSubmit = (values: FormValues) => undefined

    const itemCountChanged = (count: number) => setTotalCount(count)

    if (fetching) return <Loader/>

    return <>
        <section>
            <div className={cx('total-count')}>Всего сфер работы: {totalCount}</div>
        </section>

        <Grid templateColumns={'7fr 5fr'}>
            <Formik<FormValues> enableReinitialize
                                initialValues={getInitialValues()}
                                validationSchema={getValidationSchema}
                                onSubmit={onSubmit}>
                <FieldArray name='activities' render={props => <Items {...props} itemCountChanged={itemCountChanged}/>}/>
            </Formik>
        </Grid>
    </>
}

export default observer(Activities)
