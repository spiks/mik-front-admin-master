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

export interface IFormHobby {
    id?: string
    name: string
}

interface FormValues {
    hobbies: IFormHobby[]
}

const Hobbies: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [hobbies, setHobbies] = useState<IFormHobby[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)

    const fetchHobbies = async () => {
        setFetching(true)

        try {
            const response = await api.Hobbies.list()

            setHobbies(response.hobbies)
            setTotalCount(response.hobbies.length)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchHobbies())()
    }, [])

    const getInitialValues = () => ({hobbies})

    const getValidationSchema = () => object({
        hobbies: array().of(object({
            name: requiredString()
        }))
    })

    const onSubmit = (values: FormValues) => undefined

    const itemCountChanged = (count: number) => setTotalCount(count)

    if (fetching) return <Loader/>

    return <>
        <section>
            <div className={cx('total-count')}>Всего хобби: {totalCount}</div>
        </section>

        <Grid templateColumns={'7fr 5fr'}>
            <Formik<FormValues> enableReinitialize
                                initialValues={getInitialValues()}
                                validationSchema={getValidationSchema}
                                onSubmit={onSubmit}>
                <FieldArray name='hobbies' render={props => <Items {...props} itemCountChanged={itemCountChanged}/>}/>
            </Formik>
        </Grid>
    </>
}

export default observer(Hobbies)
