import React, {useEffect, useCallback} from 'react'
import {Field, useFormikContext} from 'formik'

import FormCheckbox from 'common/components/formItems/FormCheckbox'
import {usePrevious} from 'common/utils/hooks'

import {VaccinationFormValues} from '../../helpers/data'

const FormDiseasesRisk: React.FC = () => {
    const {values: {diseases}, setFieldValue} = useFormikContext<VaccinationFormValues>()

    const diseasesHaveRisk = useCallback(() => diseases.some(d => !!d.risk), [diseases])

    const prevLength = usePrevious(diseases.length)

    useEffect(() => {
        if (!diseasesHaveRisk()) {
            setFieldValue('diseases_risk', false)
        }
    }, [prevLength])

    return (
        <div>
            <Field name='diseases_risk'
                   className='mt-32 mb-32'
                   label='Вакцинация для группы риска'
                   component={FormCheckbox}
                   disabled={!diseasesHaveRisk()}/>
        </div>
    )
}

export default FormDiseasesRisk
