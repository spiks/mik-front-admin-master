import React from 'react'
import {TextH2} from '../text/Text'
import Flex from '../flex/Flex'
import Checkbox from './Checkbox'

export interface CheckboxGroupItem<CheckboxValueType> {
    label: string
    value: CheckboxValueType
}

interface Props<CheckboxValueType> {
    title: string
    values: CheckboxGroupItem<CheckboxValueType>[]
    checked: CheckboxValueType[]
    onCheck: (checked: CheckboxValueType[]) => void
    className?: string
}

const CheckboxesGroup = <CheckboxValueType extends {}>({title, values, checked, onCheck, className}: Props<CheckboxValueType>) => {
    const checkedSet = new Set(checked)

    const onChange = (value: CheckboxValueType) => {
        if (checkedSet.has(value)) {
            checkedSet.delete(value)
        } else {
            checkedSet.add(value)
        }

        onCheck([...checkedSet])
    }

    return (
        <div className={className}>
            <TextH2>{title}</TextH2>
            <Flex wrap>
                {values.map((item, index) =>
                    <Checkbox key={index} label={item.label} checked={checkedSet.has(item.value)} onChange={() => onChange(item.value)}/>
                )}
            </Flex>
        </div>
    )
}

export default CheckboxesGroup
