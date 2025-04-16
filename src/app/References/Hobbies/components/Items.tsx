import React, {useState} from 'react'
import {Field, FieldArrayRenderProps, getIn} from 'formik'

import api from 'services/ApiService'

import FormInput from 'common/components/formItems/FormInput'
import {IconClose} from 'common/components/icon/Icons'
import Button from 'common/components/button/Button'
import Grid from 'common/components/grid/Grid'
import notificationsStore from 'common/components/notifications/NotificationsStore'

import {IFormHobby} from '../Hobbies'

const cx = require('classnames/bind').bind({...require('../styles/form-items.scss'), ...require('../../styles/references.scss')})

let changedItems: number[] = []

interface Props {
    itemCountChanged: (count: number) => void
}

const Items: React.FC<FieldArrayRenderProps & Props> = props => {
    const items: IFormHobby[] = getIn(props.form.values, props.name)
    const [deleting, setDeleting] = useState<number[]>([])
    const [saving, setSaving] = useState<number[]>([])

    const fieldName = (index: number) => (field: string) => `${props.name}.${index}.${field}`

    const addItem = () => {
        props.push({id: undefined, name: ''})
        props.itemCountChanged(items.length + 1)
    }

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
                const response = await api.Hobbies.create({name: item.name})
                props.replace(index, response.hobby)
                notificationsStore.addSuccess('Добавлено новое хобби')
            } else if (changedItems.includes(index)) {
                await api.Hobbies.update(item.id, {name: item.name})
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
                await api.Hobbies.delete(item.id!)
                props.remove(index)
                props.itemCountChanged(items.length - 1)
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
        <Button icon='plus' content='Добавить хобби' onClick={addItem} className={cx('btn-add')}/>

        {items.map((item, index) => {
            return <Grid templateColumns={'auto 40px'} key={index} className={cx('hobby')}>
                <Field name={fieldName(index)('name')}
                       label='Хобби'
                       autoFocus={item.id === undefined}
                       component={FormInput}
                       disabled={saving.includes(index)}
                       onChange={onChange(index)}
                       onBlur={onBlur(index)}
                       onKeyUp={onKeyUp(index)}
                       className={cx('input')}/>
                {item.id &&
                <IconClose onClick={onDelete(index)} className={cx('btn-delete', {disabled: deleting.includes(index)})}/>
                }
            </Grid>
        })}
    </section>
}

export default Items
