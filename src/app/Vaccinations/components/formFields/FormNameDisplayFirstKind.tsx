import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Field, useFormikContext} from 'formik'

import FormInput from 'common/components/formItems/FormInput'

import {VaccinationFormValues} from '../../helpers/data'

const FormNameDisplayFirstKind: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<VaccinationFormValues>()
    const [leftOverlayMargin, setLeftOverlayMargin] = useState(0)

    const inputWrapperRef = useRef<HTMLDivElement>(null)
    const inputTextWidthHolder = useRef<HTMLDivElement>(null)

    const onWindowResize = useCallback(() => {
        if (inputTextWidthHolder.current) {
            setLeftOverlayMargin(inputTextWidthHolder.current.clientWidth)
        }
    }, [])

    const onNameDisplayChange = useCallback((value: string) => {
        setFieldValue('name_display', value, false)

        if (inputTextWidthHolder.current) {
            // fill mock div by input text
            inputTextWidthHolder.current.innerText = value
            // move overlay to left on input text width pixels
            setLeftOverlayMargin(inputTextWidthHolder.current.clientWidth)
        }
    }, [])

    useEffect(() => {
        if (inputWrapperRef.current) {
            // imperatively cut the input for place overlay in the end of input (easy way for change style of material input)
            (inputWrapperRef.current.childNodes[0] as HTMLInputElement).style.width = `calc(100% - 185px)`
        }

        // recalculate width on manually name display clearing
        setLeftOverlayMargin(0)
        onNameDisplayChange(values.name_display)

        window.addEventListener('resize', onWindowResize)

        return () => {
            window.removeEventListener('resize', onWindowResize)
        }
    }, [values.kind, values.group])

    return <div className='relative'>
        <Field name='name_display' inputRef={inputWrapperRef} required label='Название вакцинации' helperText='Например, "Дифтерия, коклюш, столбняк"'
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameDisplayChange(e.currentTarget.value)}
               component={FormInput}
        />
        <div style={{
            width: '155px',
            position: 'absolute',
            color: 'rgba(0, 0, 0, 0.87)',
            opacity: leftOverlayMargin ? 0.4 : 0,
            pointerEvents: 'none',
            marginLeft: '17px',
            left: `${leftOverlayMargin}px`,
            top: '32px'
        }}>
            , первая вакцинация
        </div>
        <div ref={inputTextWidthHolder} style={{
            display: 'inline-block',
            visibility: 'hidden',
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'auto',
            maxWidth: 'calc(100% - 185px)',
            whiteSpace: 'break-spaces'
        }}/>
    </div>
}

export default FormNameDisplayFirstKind
