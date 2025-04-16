import React from 'react'
import debounce from 'lodash/debounce'

import Autocomplete, {AutocompleteProps, Option} from './Autocomplete'

const cx = require('classnames/bind').bind(require('./styles/autocomplete.scss'))

export type AsyncSearchFunction = (search: string, setOptions: (options: Option[]) => void) => void

export interface AsyncAutocompleteProps extends AutocompleteProps {
    searchFunction: AsyncSearchFunction
}

interface Props extends AsyncAutocompleteProps {
    value: any
    multiple?: boolean
}

const AsyncAutocomplete: React.FC<Props> = props => {
    const {searchFunction, multiple = false, ...restProps} = props

    const [inputValue, setInputValue] = React.useState('')

    const [loading, setLoading] = React.useState<boolean>(false)

    const [options, setOptions] = React.useState<Option[]>([])

    const [open, setOpen] = React.useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    const fetch = React.useMemo(
        () => debounce(searchFunction, 200),
        []
    )

    React.useEffect(() => {
        let active = true

        setLoading(true)

        fetch(inputValue || (multiple ? '' : props.value?.label), (options: Option[]) => {
            if (active) {
                setOptions(options || [])

                setLoading(false)
            }
        })

        return () => {
            active = false
        }
    }, [inputValue, open, fetch])

    React.useEffect(() => {
        if (!open) {
            setLoading(false)
        }

        return () => {
            setLoading(false)
        }
    }, [open])

    return (
        <Autocomplete
            options={options}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            multiple={multiple}
            textFieldProps={{
                onChange: handleInputChange,
                value: inputValue
            }}
            {...restProps}
        />
    )
}

export default AsyncAutocomplete
