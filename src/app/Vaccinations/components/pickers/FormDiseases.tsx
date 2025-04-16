import React from 'react'
import {Field} from 'formik'

import api from 'services/ApiService'

import {Option} from 'common/components/autocomplete/Autocomplete'
import FormAsyncChipsAutocomplete from 'common/components/formItems/FormAsyncChipsAutocomplete'

const FormDiseases: React.FC = () => {
    return (
        <Field name='diseases' label='Выберите заболевания из списка'
               required
               searchFunction={async (search: string, setOptions: (options: Option[]) => void) => {
                   const res = await api.Diseases.list({search})
                   setOptions(res.diseases.map(d => ({label: d.name, value: d.id, risk: d.risk})))
               }}
               component={FormAsyncChipsAutocomplete}/>
    )
}

export default FormDiseases
