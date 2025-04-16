import React, {useState} from 'react'
import {FastField, Field, FieldArrayRenderProps, getIn} from 'formik'
import {Grid} from '@material-ui/core'

import api from 'services/ApiService'

import FormTextArea from 'common/components/formItems/FormTextArea'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {IconClose} from 'common/components/icon/Icons'

import {AdviceCreateRequest, AdviceUpdateRequest, IAdvice} from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/advices.scss'))

const fieldName = (index: number) => `advices.${index}.text`

const AdvicesList: React.FC<FieldArrayRenderProps> = arrProps => {
    const advices = getIn(arrProps.form.values, 'advices')

    const [actualValues, setActualValues] = useState<IAdvice[]>(advices)

    const [blurTimeoutId, setBlurTimeoutId] = useState<number | null>(null)
    const [curBlurIndex, setCurBlurIndex] = useState<number | null>(null)

    const updateActualValue = (value: IAdvice, index?: number) => {
        const tmpActual = [...actualValues]

        if (index) {
            tmpActual[index] = value
        } else {
            tmpActual.push(value)
        }

        setActualValues(tmpActual)
    }

    const onBlur = async (e: React.FocusEvent<HTMLTextAreaElement>, index: number) => {
        const adviceId = advices[index].id
        const advicePreValue = actualValues[index].text
        const adviceCurValue = e.currentTarget.value
        const fieldHasError: boolean = !!getIn(arrProps.form.errors, fieldName(index))

        setCurBlurIndex(index)
        setBlurTimeoutId(setTimeout(async () => {
            arrProps.form.setFieldTouched(fieldName(index), true)

            if (adviceCurValue.trim() === '' || adviceCurValue === advicePreValue || fieldHasError)
                return

            if (adviceId) {
                const updatedAdvice: IAdvice = {id: adviceId, text: adviceCurValue}
                await api.Advices.update(adviceId, updatedAdvice as AdviceUpdateRequest)
                arrProps.replace(index, updatedAdvice)

                updateActualValue(updatedAdvice, index)
            } else {
                const resp = await api.Advices.create({text: adviceCurValue} as AdviceCreateRequest)
                arrProps.replace(index, resp.advice)

                updateActualValue(resp.advice, index)
            }

            notificationsStore.addSuccess('Совет сохранен')
            setCurBlurIndex(index)
        }, 500))
    }

    const handleAdd = () => {
        arrProps.push({id: '', text: ''} as IAdvice)

        updateActualValue({id: '', text: ''} as IAdvice)

        setTimeout(() => {
            Array.from(document.getElementsByTagName('textarea')).pop()?.focus()
        }, 0)
    }

    const handleDelete = async (item: IAdvice, index: number) => {
        if (blurTimeoutId && index === curBlurIndex) {
            clearTimeout(blurTimeoutId)
            setCurBlurIndex(null)
            setBlurTimeoutId(null)
        }

        if (item.id) {
            await api.Advices.delete(item.id)
            notificationsStore.addSuccess(`Совет удален`)
        }

        arrProps.form.setFieldTouched(fieldName(index), false)

        arrProps.remove(index)
    }

    return <>
        <Grid container spacing={4}>
            {advices.map((item: any, index: any): JSX.Element =>
                <Grid item xs={4} key={index}>
                    <div className={cx('advice-text-wrapper')}>
                        <Field type='hidden' name={`advices.${index}.id`}/>
                        {
                            <IconClose className={cx('advice-remove')} onClick={() => handleDelete(item, index)}/>
                        }
                        <FastField label='Сообщение'
                               className={cx('advice-field')}
                               name={`advices.${index}.text`}
                               component={FormTextArea}
                               onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => onBlur(e, index)}
                        />
                    </div>
                </Grid>)}
            <Grid item xs={4}>
                <div className={cx('add-advice')} onClick={handleAdd}>
                    <Button icon='plus' content='Добавить совет'/>
                </div>
            </Grid>
        </Grid>
    </>
}

export default AdvicesList
