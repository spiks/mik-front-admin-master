import * as React from 'react'

interface Props {
    value: string
    onChange: (value: string) => void
}

export const RadioContext = React.createContext({
    value: '',
    // tslint:disable-next-line:no-empty
    onChange: (value: string) => {}
})

const RadioProvider: React.FC<Props> = props => {
    return (
        <RadioContext.Provider value={{value: props.value, onChange: props.onChange}}>
            {props.children}
        </RadioContext.Provider>
    )
}

export default RadioProvider
