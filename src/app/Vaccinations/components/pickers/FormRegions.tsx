import React, {useEffect} from 'react'
import {Field, useFormikContext} from 'formik'

import api from 'services/ApiService'

import {Option} from 'common/components/autocomplete/Autocomplete'
import FormAsyncChipsAutocomplete from 'common/components/formItems/FormAsyncChipsAutocomplete'

import {VaccinationFormValues} from '../../helpers/data'

interface Props {
    label: string
}

const FormRegions: React.FC<Props> = ({label}) => {
    const {setFieldValue} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        return () => {
            setFieldValue('regions', [])
        }
    }, [])

    return (
        <Field name='regions' label={label}
               searchFunction={async (search: string, setOptions: (options: Option[]) => void) => {
                   const res = await api.Regions.list({search})
                   setOptions(res.regions.map(i => ({label: i.name, value: i.id})))
               }}
               component={FormAsyncChipsAutocomplete}/>
    )
}

export default FormRegions
