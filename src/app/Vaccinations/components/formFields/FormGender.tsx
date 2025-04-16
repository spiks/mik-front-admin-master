import React from 'react'
import {Field, useFormikContext} from 'formik'

import FormCheckbox from 'common/components/formItems/FormCheckbox'
import {TextBodyBold} from 'common/components/text/Text'

import {VaccinationFormValues} from '../../helpers/data'

const FormGender: React.FC = () => {
    const {values: {gender_male, gender_female}} = useFormikContext<VaccinationFormValues>()

    const onlyOnePicked = [gender_male, gender_female].filter(v => v).length === 1

    return <>
        <TextBodyBold className='mt-40'>Вакцинация предназначена для</TextBodyBold>
        <Field name='gender_male' label='Мужчин' disabled={onlyOnePicked && gender_male} component={FormCheckbox}/>
        <Field name='gender_female' className='ml-16' label='Женщин' disabled={onlyOnePicked && gender_female} component={FormCheckbox}/>
    </>
}

export default FormGender
