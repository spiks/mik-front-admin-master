import React from 'react'
import FormRadioGroup from 'common/components/formItems/FormRadioGroup'
import {TextBodyBold} from 'common/components/text/Text'
import Flex from 'common/components/flex/Flex'
import Radio from 'common/components/radio/Radio'
import {VaccinationKind} from '../../interfaces/models'
import {Field, useFormikContext} from 'formik'
import {VaccinationFormValues} from '../../helpers/data'

interface Props {
    editMode: boolean
}

const FormKind: React.FC<Props> = ({editMode}) => {
    const {values, setFieldValue} = useFormikContext<VaccinationFormValues>()

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, value: VaccinationKind) => {
        if ([VaccinationKind.FIRST, VaccinationKind.ONCE].includes(value) && values.previous?.name_display_next === values.name_display) {
            setFieldValue('name_display', '')
        }

        setFieldValue('kind', value, false)
    }

    return (
        <Field name='kind' onChange={onChange} component={FormRadioGroup}>
            <TextBodyBold>Порядковый номер вакцины</TextBodyBold>
            <Flex>
                <Radio disabled={editMode} label='Первая' value={VaccinationKind.FIRST}/>
                <Radio disabled={editMode} label='Промежуточная' value={VaccinationKind.SUBSEQUENT}/>
                <Radio disabled={editMode} label='Завершающая' value={VaccinationKind.LAST}/>
                <Radio disabled={editMode} label='Разовая' value={VaccinationKind.ONCE}/>
            </Flex>
        </Field>

    )
}

export default FormKind
