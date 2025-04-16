import React, {useEffect} from 'react'
import {Field, useFormikContext} from 'formik'

import api from 'services/ApiService'

import {Option} from 'common/components/autocomplete/Autocomplete'
import FormAsyncChipsAutocomplete from 'common/components/formItems/FormAsyncChipsAutocomplete'

import {VaccinationFormValues} from '../../helpers/data'
import {VaccinationGroup} from '../../interfaces/models'

const FormCountries: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        return () => {
            setFieldValue('countries', [])
        }
    }, [])

    return (
        <Field name='countries' required={values.group === VaccinationGroup.TS} label='Страны, к которым относится прививка'
               searchFunction={async (search: string, setOptions: (options: Option[]) => void) => {
                   const res = await api.Countries.list({search})
                   setOptions(res.countries.map(i => ({label: i.name, value: i.id})))
               }}
               component={FormAsyncChipsAutocomplete}/>
    )
}

export default FormCountries
