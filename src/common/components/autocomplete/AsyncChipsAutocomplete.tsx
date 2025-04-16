import React from 'react'

import {Option} from './Autocomplete'
import AsyncAutocomplete, {AsyncAutocompleteProps} from './AsyncAutocomplete'
import AutocompleteChipsList, {AutocompleteChipsListChangeType} from './AutocompleteChipsList'

const cx = require('classnames/bind').bind(require('./styles/autocomplete.scss'))

export interface AsyncChipsAutocompleteProps extends AsyncAutocompleteProps {
    value: Option[]
}

const AsyncChipsAutocomplete: React.FC<AsyncChipsAutocompleteProps> = props => {
    return (
        <>
            <AsyncAutocomplete
                classes={{
                    input: cx('autocomplete-input', 'with-icon'),
                    focused: cx('autocomplete-input-focused')
                }}
                icon='tag'
                multiple
                {...props}
            />

            <AutocompleteChipsList value={props.value} onChange={props.onChange as AutocompleteChipsListChangeType}/>
        </>
    )
}

export default AsyncChipsAutocomplete
