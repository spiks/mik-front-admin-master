import React from 'react'
import MaterialAutocomplete, {AutocompleteProps as MaterialAutocompleteProps} from '@material-ui/lab/Autocomplete'
import Grid from '@material-ui/core/Grid'
import {UseAutocompleteProps} from '@material-ui/lab/useAutocomplete'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import {OutlinedInputProps} from '@material-ui/core/OutlinedInput'
import {OutlinedTextFieldProps} from '@material-ui/core/TextField'

import Icon from 'common/components/icon/Icon'

import TextField from '../inputs/TextField'

export interface Option<T = string | number> {
    value: T
    label: string
}

const cx = require('classnames/bind').bind(require('./styles/autocomplete.scss'))

export interface AutocompleteProps extends Partial<MaterialAutocompleteProps<Option>> {
    label: React.ReactNode
    name?: string
    icon?: string
    error?: string
    required?: boolean
    textFieldProps?: Partial<OutlinedTextFieldProps>
    inputProps?: Partial<OutlinedInputProps>
    onChange?: (value: any) => void
    options: Option[]
}

const Autocomplete: React.FC<AutocompleteProps & UseAutocompleteProps<Option>> = props => {
        const {inputProps, textFieldProps, error, required, loading, label, icon, classes, name, onChange, ...restProps} = props

        return (
            <MaterialAutocomplete
                classes={{
                    root: cx('autocomplete-root'),
                    input: cx('autocomplete-input'),
                    ...classes
                }}
                getOptionLabel={option => option?.label || ''}
                getOptionSelected={(option, value) => option.value === value.value}
                noOptionsText='Ничего не найдено'
                clearText='Очистить'
                openText='Открыть'
                loadingText='Загрузка...'
                autoComplete
                loading={loading}
                popupIcon={<Icon className={cx({'popup-disabled': props.disabled})} name='accordeon'/>}
                onChange={onChange ? (e: React.ChangeEvent<{}>, value: any[]) => onChange(value) : undefined}
                renderInput={renderInputProps => {
                    const {InputLabelProps, ...rest} = renderInputProps

                    return <TextField
                        {...rest}
                        name={name}
                        label={label}
                        error={!!error}
                        helperText={error}
                        fullWidth
                        margin='normal'
                        required={required}
                        InputProps={{
                            ...renderInputProps.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color='inherit' size={20}/> : null}
                                    {renderInputProps.InputProps.endAdornment}
                                </>
                            ),
                            startAdornment: (
                                icon && <InputAdornment position='start' className={cx('input-icon')}>
                                    <Icon name={icon} className='ml-12'/>
                                </InputAdornment>
                            ),
                            ...inputProps
                        }}
                        {...textFieldProps}
                    />
                }}
                renderOption={option => (
                    <Grid container alignItems='center'>
                        <Grid item xs>
                            <Typography variant='body2'>
                                {option.label}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                {...restProps}
            />
        )
    }

export default Autocomplete
