import React, {useState} from 'react'
import {FormHelperText} from '@material-ui/core'
import {FieldProps, getIn} from 'formik'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import {EditorState, convertToRaw, ContentState} from 'draft-js'

import {FormTextFieldProps} from './FormTextField'
import {TextH2} from '../text/Text'

const cx = require('classnames/bind').bind(require('./styles/text-field-wysiwyg.scss'))

const FormTextAreaWysiwyg: React.FC<FormTextFieldProps & FieldProps> = ({form, field, label, required, placeholder}) => {
    const [editorState, setEditorState] =
        useState<EditorState>(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(field.value).contentBlocks)))

    const [focused, setFocused] = useState(false)

    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return <div className='mb-8 mt-16'>
        <TextH2 className='mb-16'>{label}{required && <span className='text-red-900'>*</span>}</TextH2>
        <Editor editorState={editorState}
                stripPastedStyles
                placeholder={placeholder || 'Введите текст'}
                onChange={(e) => {
                    const rawState = convertToRaw(editorState.getCurrentContent())
                    form.setFieldValue(field.name, (rawState.blocks.length === 1 && rawState.blocks[0].text === '') ? '' : draftToHtml(rawState))
                }}
                onFocus={() => {
                    setFocused(true)
                    form.setFieldTouched(field.name, true)
                }}
                onBlur={() => setFocused(false)}
                onEditorStateChange={setEditorState}
                editorClassName={cx('editor', {focused, error: !!errorText})}
                toolbar={{
                    options: ['inline'],
                    inline: {options: ['bold']}
                }}
        />
        {!!errorText && <FormHelperText error classes={{root: 'ml-14 mr-14'}}>{errorText}</FormHelperText>}
    </div>
}

export default FormTextAreaWysiwyg
