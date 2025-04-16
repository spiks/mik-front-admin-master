import React, {useMemo} from 'react'
import {Field, useFormikContext} from 'formik'

import FormInput from 'common/components/formItems/FormInput'

import {VaccinationFormValues} from '../../helpers/data'
import {VaccinationKind} from '../../interfaces/models'
import FormNameDisplayFirstKind from './FormNameDisplayFirstKind'

const FormNameDisplay: React.FC = () => {
    const {values} = useFormikContext<VaccinationFormValues>()

    const showFirstVaccinationHint = useMemo(() => values.kind === VaccinationKind.FIRST && !values.name, [values.name, values.kind])

    return showFirstVaccinationHint
        && <FormNameDisplayFirstKind/>
        || <Field name='name_display' required label='Название вакцинации' helperText='Например, "Дифтерия, коклюш, столбняк"' component={FormInput}/>
}

export default FormNameDisplay
