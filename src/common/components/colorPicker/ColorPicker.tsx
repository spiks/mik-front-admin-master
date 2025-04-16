import * as React from 'react'
import {ChromePicker, ColorPickerProps} from 'react-color'

const ColorPicker: React.FC<ColorPickerProps<{}>> = props => {
    const {color, onChange} = props

    return <ChromePicker color={color} onChange={onChange} disableAlpha/>
}

export default ColorPicker
