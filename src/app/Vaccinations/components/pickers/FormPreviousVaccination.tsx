import React, {useEffect} from 'react'
import {Field, useFormikContext} from 'formik'

import api from 'services/ApiService'

import FormAsyncAutocomplete from 'common/components/formItems/FormAsyncAutocomplete'

import {PreviousVaccinationOption, VaccinationFormValues} from '../../helpers/data'

interface Props {
    disabled: boolean
}

const FormPreviousVaccination: React.FC<Props> = ({disabled}) => {
    const {values: {group, name_display}, setFieldValue} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        return () => {
            setFieldValue('previous', null)
        }
    }, [])

    return (
        <Field name='previous' label='Укажите предыдущую вакцинацию'
               disabled={disabled}
               required
               searchFunction={async (search: string, setOptions: (options: PreviousVaccinationOption[]) => void) => {
                   const res = await api.Vaccinations.previous({search, group: group || undefined})

                   setOptions(res.vaccinations.map(v => ({
                       ...v,
                       value: v.id,
                       label: v.name_display
                   })))
               }}
               onChange={(option: PreviousVaccinationOption | null) => {
                   if (option && !name_display) {
                       setFieldValue('name_display', option.name_display_next)
                   }
               }}
               component={FormAsyncAutocomplete}/>
    )
}

export default FormPreviousVaccination
