import React, {useEffect, useState} from 'react'
import {Field, useFormikContext} from 'formik'

import api from 'services/ApiService'

import FormSyncChipsAutocomplete from 'common/components/formItems/FormSyncChipsAutocomplete'
import Loader from 'common/components/loader/Loader'

import {IActivity} from '../../../References/Activities/interfaces/models'
import {VaccinationFormValues} from '../../helpers/data'

const FormActivities: React.FC = () => {
    const [activities, setActivities] = useState<IActivity[]>([])
    const [fetching, setFetching] = useState(false)

    const {setFieldValue} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        (async () => {
            setFetching(true)

            try {
                const res = await api.Activities.list()
                setActivities(res.activities)
            } finally {
                setFetching(false)
            }
        })()

        return () => {
            setFieldValue('activities', [])
        }
    }, [])

    if (fetching) return <Loader/>

    return (
        <Field name='activities' label='Сфера работы'
               options={activities.map(i => ({label: i.name, value: i.id}))}
               component={FormSyncChipsAutocomplete}/>
    )
}

export default FormActivities
