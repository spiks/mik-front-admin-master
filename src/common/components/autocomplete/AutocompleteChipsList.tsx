import React from 'react'

import Chip from 'common/components/chip/Chip'

import {Option} from './Autocomplete'

export type AutocompleteChipsListChangeType = (value: Option[]) => void

interface Props {
    value: Option[]
    onChange: AutocompleteChipsListChangeType
}

const AutocompleteChipsList: React.FC<Props> = props => {
    return (
        <div>
            {props.value?.map((item, index) => <Chip key={index} label={item.label} onDelete={() => {
                props.value!.splice(index, 1)

                props.onChange(props.value)
            }}/>)}
        </div>
    )
}

export default AutocompleteChipsList
