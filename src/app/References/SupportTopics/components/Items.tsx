import React, {useState} from 'react'
import {Field, FieldArrayRenderProps, getIn} from 'formik'

import api from 'services/ApiService'

import FormInput from 'common/components/formItems/FormInput'
import Grid from 'common/components/grid/Grid'
import Button from 'common/components/button/Button'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {IconClose} from 'common/components/icon/Icons'

import {IFormSupportTopic} from '../SupportTopics'

const cx = require('classnames/bind').bind({...require('../styles/form-items.scss'), ...require('../../styles/references.scss')})

let changedItems: number[] = []

const Items: React.FC<FieldArrayRenderProps> = props => {
    const items: IFormSupportTopic[] = getIn(props.form.values, props.name)
    const [deleting, setDeleting] = useState<number[]>([])
    const [saving, setSaving] = useState<number[]>([])

    const fieldName = (index: number) => (field: string) => `${props.name}.${index}.${field}`

    const addItem = () => props.push({id: undefined, name: '', request_count: 0})

    const saveItem = async (index: number) => {
        const item = items[index]
        const errors = getIn(props.form.errors, props.name)

        if (deleting.includes(index) || saving.includes(index)) {
            return
        }

        if (errors && errors.hasOwnProperty(index)) {
            return
        }

        setSaving([...saving, index])

        try {
            if (!item.id) {
                const response = await api.SupportTopics.create({name: item.name})
                props.replace(index, response.topic)
                notificationsStore.addSuccess('Добавлена новая тема обращения')
            } else if (changedItems.includes(index)) {
                await api.SupportTopics.update(item.id, {name: item.name})
                notificationsStore.addSuccess('Изменения сохранены')
            }
        } finally {
            changedItems = changedItems.filter(v => v !== index)
            setSaving(saving.filter(v => v !== index))
        }
    }

    const onDelete = (index: number) => {
        return async () => {
            const item = items[index]

            setDeleting([...deleting, index])

            try {
                await api.SupportTopics.delete(item.id!)
                props.remove(index)
                notificationsStore.addSuccess('Запись удалена')
            } finally {
                setDeleting(deleting.filter(v => v !== index))
            }
        }
    }

    const onChange = (index: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (items[index].name !== e.currentTarget.value && !changedItems.includes(index)) {
                changedItems.push(index)
            }

            props.form.handleChange(e)
        }
    }

    const onBlur = (index: number) => {
        return async (e: React.FocusEvent<HTMLInputElement>) => {
            props.form.handleBlur(e)
            setTimeout(async () => saveItem(index), 0)
        }
    }

    const onKeyUp = (index: number) => {
        return (e: React.KeyboardEvent) => e.keyCode === 13 && saveItem(index)
    }

    return <section>
        <Button icon='plus' content='Добавить тему' onClick={addItem} className={cx('btn-add')}/>

        <Grid templateColumns={'7fr max-content 14px'} className={cx('grid')}>
            {items.map((item, index) => {
                return <React.Fragment key={index}>
                    <Field name={fieldName(index)('name')}
                           label='Тема обращения'
                           component={FormInput}
                           disabled={saving.includes(index)}
                           autoFocus={item.id === undefined}
                           onChange={onChange(index)}
                           onBlur={onBlur(index)}
                           onKeyUp={onKeyUp(index)}
                           className={cx('input')}/>
                    {item.id && <div className={cx('request-count')}>
                        Обращений по теме: <span>{item.request_count}</span>
                    </div> || <div/>}
                    {item.id &&
                    <IconClose onClick={onDelete(index)} className={cx('btn-delete', 'ml-0', {disabled: deleting.includes(index)})}/>
                    || <div/>
                    }
                </React.Fragment>
            })}
        </Grid>
    </section>
}

export default Items
