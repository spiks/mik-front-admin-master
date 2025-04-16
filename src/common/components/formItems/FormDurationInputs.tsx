import React, {useEffect} from 'react'
import {Field, getIn, useFormikContext} from 'formik'

import {initialDuration, VaccinationFormValues} from 'app/Vaccinations/helpers/data'

import FormInputInteger from './FormInputInteger'
import Grid from '../grid/Grid'
import {TextBody, TextBodyBold} from '../text/Text'
import Flex from '../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/text-field.scss'))

interface Props {
    fieldName: string
    required?: boolean
    title?: string
    leftLabel?: string
    years?: boolean
    months?: boolean
    days?: boolean
    className?: string
}

const FormDurationInputs: React.FC<Props> = ({title, fieldName, required, leftLabel, className, years = true, months = true, days = true}) => {
    const {touched, errors, setFieldValue} = useFormikContext<VaccinationFormValues>()

    useEffect(() => {
        return () => {
            setFieldValue(fieldName, initialDuration)
        }
    }, [])

    const anyFieldTouched = !!getIn(touched, fieldName) && Object.keys(getIn(touched, fieldName)).length !== 0 || false
    const errorText = getIn(errors, fieldName)
    const hasError = anyFieldTouched && !!errorText

    const fieldsContent = <>
        <Grid templateColumns='repeat(3, 120px)' style={{columnGap: '8px'}} className='mr-8'>
            {years && <Field name={`${fieldName}.years`} label='Лет' error={hasError} component={FormInputInteger}/>}
            {months && <Field name={`${fieldName}.months`} label='Месяцев' error={hasError} component={FormInputInteger}/>}
            {days && <Field name={`${fieldName}.days`} label='Дней' error={hasError} component={FormInputInteger}/>}
        </Grid>
    </>

    return <div className={className}>
        {title && <TextBodyBold className={cx({required})}>{title}</TextBodyBold>}
        {leftLabel && <Flex alignItemsCenter>
            <TextBody className='text-shade-60 mr-12 mt-6'>{leftLabel}</TextBody>
            {fieldsContent}
        </Flex> || fieldsContent}
        {hasError && <TextBody className={cx('text-red-900', 'field-error')}>{errorText}</TextBody>}
    </div>
}

export default FormDurationInputs
