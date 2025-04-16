import React from 'react'
import {Field} from 'formik'

import {TextBodyBold} from 'common/components/text/Text'
import Grid from 'common/components/grid/Grid'
import FormDatePicker from 'common/components/formItems/FormDatePicker'

const DatePeriodFields: React.FC = () => {
    return (
        <div className='mt-32'>
            <TextBodyBold>Период рекомендации</TextBodyBold>
            <Grid templateColumns='200px 200px' style={{gap: 16}}>
                <Field name='active_from' label='C' component={FormDatePicker}/>
                <Field name='active_to' label='ПО' component={FormDatePicker}/>
            </Grid>
        </div>
    )
}

export default DatePeriodFields
