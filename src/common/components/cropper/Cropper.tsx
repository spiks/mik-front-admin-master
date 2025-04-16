import * as React from 'react'
import CropperComponent from 'react-cropper'
import CropperJs from 'cropperjs'

import 'cropperjs/dist/cropper.min.css'

import './styles/cropper.scss'

interface Props extends CropperJs.Options, Omit<React.HTMLProps<HTMLImageElement>, 'data' | 'ref'> {
    getCropRefs: (cropRefs: CropperComponent) => void
}

class Cropper extends React.Component<Props> {
    private cropperRefs: CropperComponent

    render() {
        const {getCropRefs, ...rest} = this.props

        return <CropperComponent
            ref={el => this.cropperRefs = el!}
            crop={() => getCropRefs(this.cropperRefs)}
            {...rest}/>
    }
}

export default Cropper
