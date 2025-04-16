import React from 'react'
import {useFormikContext} from 'formik'

import {TextH2} from 'common/components/text/Text'
import FormDurationInputs from 'common/components/formItems/FormDurationInputs'

import FormRegions from './pickers/FormRegions'
import FormCountries from './pickers/FormCountries'
import {VaccinationFormValues} from '../helpers/data'
import {VaccinationGroup} from '../interfaces/models'

interface Props {
    withTitle: boolean
    className?: string
}

const TouristicFields: React.FC<Props> = ({withTitle, className}) => {
    const {values} = useFormikContext<VaccinationFormValues>()

    return (
        <div className={className}>
            {withTitle && <TextH2 className='mb-8'>Для рекомендаций по туристическому календарю</TextH2>}
            <FormCountries/>
            {values.countries.some(c => c.label === 'Россия') && <FormRegions label='Укажите регионы России, если нужно'/>}
            <FormDurationInputs className='mt-24' title='Поставить вакцину заблаговременно, за'
                                required={values.group === VaccinationGroup.TS}
                                fieldName='countries_injection_budget'/>
        </div>
    )
}

export default TouristicFields
