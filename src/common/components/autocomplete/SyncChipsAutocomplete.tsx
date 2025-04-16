import React from 'react'
import {createFilterOptions} from '@material-ui/lab'

import Autocomplete, {AutocompleteProps, Option} from './Autocomplete'
import AutocompleteChipsList, {AutocompleteChipsListChangeType} from './AutocompleteChipsList'

const cx = require('classnames/bind').bind(require('../autocomplete/styles/autocomplete.scss'))

export interface SyncChipsAutocompleteProps extends AutocompleteProps {
    value: Option[]
}

const SyncChipsAutocomplete: React.FC<SyncChipsAutocompleteProps> = props => {
        const filterOptions = createFilterOptions<Option>({
            stringify: option => option.label
        })

        return (
            <>
                <Autocomplete
                    classes={{
                        input: cx('autocomplete-input', 'with-icon'),
                        focused: cx('autocomplete-input-focused')
                    }}
                    icon='tag'
                    multiple
                    filterOptions={filterOptions}
                    {...props}
                />

                <AutocompleteChipsList value={props.value} onChange={props.onChange as AutocompleteChipsListChangeType}/>
            </>
        )
    }

export default SyncChipsAutocomplete
