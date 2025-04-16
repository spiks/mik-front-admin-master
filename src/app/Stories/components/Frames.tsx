import React from 'react'
import {FastField, Field, FieldArrayRenderProps, getIn} from 'formik'

import {TextBodyBold, TextH2} from 'common/components/text/Text'
import FormInput from 'common/components/formItems/FormInput'
import FormImage from 'common/components/formItems/FormImage'
import FormTextArea from 'common/components/formItems/FormTextArea'
import Button from 'common/components/button/Button'
import Flex from 'common/components/flex/Flex'
import Grid from 'common/components/grid/Grid'
import FormRadioGroup from 'common/components/formItems/FormRadioGroup'
import Radio from 'common/components/radio/Radio'
import FormCheckbox from 'common/components/formItems/FormCheckbox'
import FormColorPicker from 'common/components/formItems/FormColorPicker'

import {defaultFrame} from '../helpers/data'
import {FrameControlsColor, FramePosition, IFrame} from '../interfaces/frames'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'

const Frames: React.FC<FieldArrayRenderProps> = props => {
    const frames: IFrame[] = getIn(props.form.values, props.name)

    return <>
        {frames.map((frame, index) => {
            const fieldName = (field: string) => `${props.name}.${index}.${field}`
            const getFieldValue = (field: string) => getIn(props.form.values, `${props.name}.${index}.${field}`)

            return <div key={index} className='mt-40'>
                <TextH2 className='mb-8'>{`Кадр ${index + 1}`}</TextH2>

                <FastField name={fieldName('header1')} required label='Заголовок кадра' component={FormInput}/>
                <FastField name={fieldName('image')} className='mt-8 mb-8' component={FormImage}
                           dropzoneProps={{buttonTitle: 'Изображение для кадра'}}
                           previewProps={{width: '112px', height: '200px'}}
                           cropModalProps={{
                               title: `Изображение для кадра ${index + 1}`,
                               subtitle: `Выбранная область будет показываться\nна миниатюре истории на главной странице`
                           }}
                />
                <FastField name={fieldName('description')} required label='Текст для кадра' component={FormTextArea}/>

                <Grid className='mt-32' alignItemsCenter templateColumns='1fr 1fr'>
                    <FastField name={fieldName('text_color')} label='Цвет текста' component={FormColorPicker}/>
                    <FastField name={fieldName('position')} className='ml-40 mt-8' component={FormRadioGroup}>
                        <TextBodyBold>Текст располагается</TextBodyBold>
                        <Flex>
                            <Radio label='Снизу' value={FramePosition.BOTTOM}/>
                            <Radio label='Сверху' value={FramePosition.TOP}/>
                        </Flex>
                    </FastField>
                </Grid>

                <FastField name={fieldName('action_available')} className='mt-24' label='На кадре будет кнопка' component={FormCheckbox}/>
                <Grid templateColumns='1fr 1fr' style={{columnGap: '10px'}}>
                    <Field name={fieldName('action_text')} label='Текст на кнопке'
                           disabled={!getFieldValue('action_available')}
                           component={FormInput}/>
                    <Field name={fieldName('action_url')} label='Ссылка на внешний источник'
                           disabled={!getFieldValue('action_available')}
                           component={FormInput}/>
                </Grid>

                <Grid alignItemsStart templateColumns='200px 200px auto' style={{columnGap: 40}} className='mt-24'>
                    <Flex column>
                        <TextBodyBold>Тонировка фона</TextBodyBold>
                        <Flex>
                            <FastField name={fieldName('gradient_top')} label='Сверху' component={FormCheckbox}/>
                            <FastField name={fieldName('gradient_bottom')} label='Снизу' component={FormCheckbox}/>
                        </Flex>
                    </Flex>
                    <Field name={fieldName('gradient_color')}
                           disabled={!getFieldValue('gradient_top') && !getFieldValue('gradient_bottom')}
                           className='mt-8' label='Цвет тонировки' component={FormColorPicker}/>
                    <FastField name={fieldName('controls_color')} component={FormRadioGroup}>
                        <TextBodyBold>Цвет прогрессс-бара и крестика</TextBodyBold>
                        <Flex>
                            <Radio label='Черный' value={FrameControlsColor.DARK}/>
                            <Radio label='Белый' value={FrameControlsColor.LIGHT}/>
                        </Flex>
                    </FastField>
                </Grid>

                <Flex className='mt-32'>
                    {frames.length > 1 && (
                        <Button className='mr-8' text red content={`Удалить кадр ${index + 1}`} onClick={() => {
                            if (JSON.stringify(frames[index]) === JSON.stringify(defaultFrame)) {
                                return props.remove(index)
                            }

                            modalStore.openModal({
                                content: <DeleteConfirmationModal
                                    title='Удалить кадр?'
                                    content='Заполненные данные будут утеряны'
                                    onAccept={async () => await props.remove(index)}/>,
                                small: true,
                                withCross: false
                            })
                        }}/>
                    )}
                    {index === frames.length - 1 && frames.length <= 10 && (
                        <Button icon='plus' content='Добавить еще кадр' onClick={() => props.push(defaultFrame)}/>
                    )}
                </Flex>
            </div>
        })}
        {!frames.length && <Button className='mt-32' icon='plus' content='Добавить кадр' onClick={() => props.push(defaultFrame)}/>}
    </>
}

export default Frames
