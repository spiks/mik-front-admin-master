import * as React from 'react'
import debounce from 'lodash/debounce'
import {OutlinedTextFieldProps} from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import TextField from 'common/components/inputs/TextField'
import Icon from 'common/components/icon/Icon'

const cx = require('classnames/bind').bind(require('./styles/text-field.scss'))

interface Props {
    onSetSearch: (value: string) => void
    value?: string
    endAdornment?: JSX.Element
}

interface LocalState {
    value: string
}

class SearchTextField extends React.Component<Props & Partial<OutlinedTextFieldProps>, LocalState> {
    state: LocalState = {
        value: this.props.value || ''
    }

    private searchFunc = debounce((search: string): void => {
        this.props.onSetSearch(search)
    }, 300)

    componentDidUpdate(prevProps: Readonly<Props & Partial<OutlinedTextFieldProps>>, prevState: Readonly<LocalState>, snapshot?: any): void {
        if (prevProps.value !== this.props.value) {
            this.setState({value: this.props.value || ''})
        }
    }

    render() {
        const {onSetSearch, value, InputProps, endAdornment, ...rest} = this.props

        return <TextField
            InputProps={{
                ...InputProps,
                startAdornment: (
                    <InputAdornment position='start'>
                        <Icon className={cx('search-icon')} name='search'/>
                    </InputAdornment>
                ),
                classes: {
                    input: cx('search-input')
                }
            }}
            classes={{root: cx('search-root')}}
            {...rest}
            value={this.state.value}
            onChange={this.onChange}/>
    }

    private clearSearch = (): void => {
        this.props.onSetSearch('')

        this.setState({value: ''})
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({value: e.currentTarget.value})

        this.searchFunc(e.currentTarget.value)
    }
}

export default SearchTextField
