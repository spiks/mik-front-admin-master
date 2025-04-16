import React, {ReactElement} from 'react'
import {Autocomplete, createFilterOptions} from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'

import TextField from '../inputs/TextField'
import {Option} from './Autocomplete'

const cx = require('classnames/bind').bind(require('./styles/autocomplete.scss'))

export interface SyncAutocompleteProps {
    value: Option | null
    label: string
    options: Option[]
    error?: string
    className?: string
    required?: boolean
    disableClearable?: boolean
    onChange?: (event: React.ChangeEvent<{}>, value: any) => void
    renderOption?: (option: Option) => ReactElement
    renderLabel?: (option: Option) => string
}

const SyncAutocomplete: React.FC<SyncAutocompleteProps> =
    ({
         label, options, renderLabel, onChange,
         error, value, required, className, renderOption,
         disableClearable
     }) => {
        let optionValue: Option | null = value
        // if current options's label is not empty then use current option else find label from options list
        if (!!optionValue) {
            optionValue = !!optionValue.label && optionValue || {
                value: optionValue.value,
                label: options.find(option => option.value === optionValue!.value)?.label || ''
            }
        }

        const filterOptions = createFilterOptions<Option>({
            stringify: option => option.label
        })

        return (
            <Autocomplete
                className={className}
                classes={{
                    root: cx('autocomplete-root'),
                    input: cx('autocomplete-input')
                }}
                options={options}
                getOptionLabel={option => renderLabel?.(option) || option.label}
                noOptionsText='Ничего не найдено'
                clearText='Очистить'
                openText='Открыть'
                disableClearable={disableClearable}
                renderInput={params => {
                    const {InputLabelProps, ...rest} = params
                    return <TextField
                        {...rest}
                        label={label}
                        error={!!error}
                        helperText={error}
                        size='small'
                        fullWidth
                        required={required}
                />
            }}
            renderOption={option => renderOption?.(option) || (
                <Grid container alignItems='center'>
                    <Grid item>
                        {option.label}
                    </Grid>
                </Grid>
            )}
            onChange={onChange ? onChange : undefined}
            value={optionValue}
            filterOptions={filterOptions}
        />
    )
}

export default SyncAutocomplete
