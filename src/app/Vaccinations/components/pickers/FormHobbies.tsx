import React, {useEffect, useState} from 'react'
import {Field, useFormikContext} from 'formik'

import api from 'services/ApiService'

import FormSyncChipsAutocomplete from 'common/components/formItems/FormSyncChipsAutocomplete'
import Loader from 'common/components/loader/Loader'

import {IHobby} from '../../../References/Hobbies/interfaces/models'
import {VaccinationFormValues} from '../../helpers/data'

const FormHobbies: React.FC = () => {
    const [hobbies, setHobbies] = useState<IHobby[]>([])
    const [fetching, setFetching] = useState(false)

    const {setFieldValue} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        (async () => {
            setFetching(true)

            try {
                const res = await api.Hobbies.list()
                setHobbies(res.hobbies)
            } finally {
                setFetching(false)
            }
        })()

        return () => {
            setFieldValue('hobbies', [])
        }
    }, [])

    if (fetching) return <Loader/>

    return (
        <Field name='hobbies' label='Хобби'
               options={hobbies.map(i => ({label: i.name, value: i.id}))}
               component={FormSyncChipsAutocomplete}/>
    )
}

export default FormHobbies
