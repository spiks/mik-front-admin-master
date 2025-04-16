import React, {useEffect, useMemo, useState} from 'react'
import {FastField, Form, Formik, FormikProps} from 'formik'

import history from 'services/history'
import routes from 'routes'
import api from 'services/ApiService'

import PageHeader from 'common/components/layout/PageHeader'
import PageBackButton from 'common/components/layout/PageBackButton'
import Grid from 'common/components/grid/Grid'
import {useQuery} from 'common/utils/hooks'
import Loader from 'common/components/loader/Loader'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {TextBody, TextFootnoteBold, TextH1} from 'common/components/text/Text'
import Flex from 'common/components/flex/Flex'
import FormInput from 'common/components/formItems/FormInput'
import FormTextAreaWysiwyg from 'common/components/formItems/FormTextAreaWysiwyg'
import FormDurationInputs from 'common/components/formItems/FormDurationInputs'
import FormCheckbox from 'common/components/formItems/FormCheckbox'
import Icon from 'common/components/icon/Icon'
import Button from 'common/components/button/Button'

import FieldsByGroup from './components/FieldsByGroup'
import {validate, validationSchema} from './helpers/validation'
import FormDiseases from './components/pickers/FormDiseases'
import {IVaccination, VaccinationCreateUpdateRequest, VaccinationGroup, VaccinationKind} from './interfaces/models'
import ChooseGroup from './ChooseGroup'
import {getInitialValues, mapFormToRequestData, VaccinationFormValues} from './helpers/data'
import FormPreviousVaccination from './components/pickers/FormPreviousVaccination'
import FormGender from './components/formFields/FormGender'
import FocusFormError from 'common/components/formItems/FocusFormError'
import FormKind from './components/formFields/FormKind'
import FormDiseasesRisk from './components/formFields/FormDiseasesRisk'
import FormNameDisplay from './components/formFields/FormNameDisplay'

const cx = require('classnames/bind').bind(require('./styles/vaccination-details.scss'))

const VaccinationDetails: React.FC = () => {
    const [fetching, setFetching] = useState(false)
    const [vaccination, setVaccination] = useState<IVaccination>()
    const [submitting, setSubmitting] = useState(false)

    const copyMode = useQuery().get('copy') === 'true'
    const vaccinationId = useQuery().get('vaccination_id')
    const editMode = useMemo(() => !!vaccinationId && !copyMode, [vaccinationId, copyMode])

    useEffect(() => {
        if (vaccinationId) {
            (async () => {
                setFetching(true)

                try {
                    const res = await api.Vaccinations.details(vaccinationId)
                    setVaccination(res.vaccination)
                } finally {
                    setFetching(false)
                }
            })()
        }
    }, [vaccinationId])

    if (fetching) return <Loader/>

    const submit = async (values: VaccinationFormValues) => {
        const data: VaccinationCreateUpdateRequest = mapFormToRequestData(values)

        setSubmitting(true)

        try {
            if (editMode) {
                await api.Vaccinations.update(vaccinationId!, data)
                notificationsStore.addSuccess('Вакцинация обновлена')
            } else {
                await api.Vaccinations.create(data)
                notificationsStore.addSuccess('Вакцинация добавлена')
            }

            history.push(routes.vaccinations)
        } catch {
            setSubmitting(false)
        }
    }

    const onEnabledChange = (e: React.ChangeEvent<HTMLInputElement>, props: FormikProps<VaccinationFormValues>) => {
        props.handleChange(e)

        if (e.currentTarget.checked) {
            notificationsStore.addSuccess('Вакцинация будет рекомендоваться в приложении')
        } else {
            notificationsStore.addSuccess('Вакцинация не будет рекомендована приложением')
        }
    }

    return <>
        <PageHeader>
            <PageBackButton title='все вакцинации' onClick={() => history.push(routes.vaccinations)}/>
        </PageHeader>

        <Grid templateColumns={'8fr 4fr'}>
            <Formik<VaccinationFormValues>
                enableReinitialize onSubmit={submit} initialValues={getInitialValues(vaccination, copyMode)}
                validate={validate}
                validationSchema={validationSchema}
            >
                {props => <Form>
                    <FocusFormError/>
                    <ChooseGroup activeGroup={props.values.group} onClick={group => props.setFieldValue('group', group)}
                                 disabled={editMode}/>

                    <div className={cx({'inactive': !props.values.group})}>
                        <TextBody className='mt-64'>Шаг 2</TextBody>
                        <TextH1 className='mb-32'>Заполните поля</TextH1>

                        <FormKind editMode={editMode}/>

                        {[VaccinationKind.SUBSEQUENT, VaccinationKind.LAST].includes(props.values.kind) && (
                            <FormPreviousVaccination disabled={editMode}/>
                        )}
                        <FormNameDisplay/>

                        <FastField name='injection_place' label='Место введения' component={FormInput}/>
                        <FastField name='description' label='Описание прививки' component={FormTextAreaWysiwyg}/>

                        <FormDiseases/>

                        <FormDurationInputs className='mt-24' required title='Вакцинация действует в течение' fieldName='duration'/>
                        {[VaccinationKind.LAST, VaccinationKind.ONCE].includes(props.values.kind) && <>
                            <FastField name='need_revaccination' label='Нужна ревакцинация' component={FormCheckbox}/>
                            {props.values.need_revaccination && (
                                <Flex alignItemsCenter>
                                    <FormDurationInputs className='mt-8 flex-shrink-0' required title='Рекомендовать ревакцинацию через'
                                                        fieldName='revaccination'/>
                                    <TextFootnoteBold className='ml-16 mt-4'>
                                        Укажите промежуток времени, через который необходимо начать рекомендовать ревакцинацию пользователю.{`\n`}
                                        Значение в поле "Рекомендовать ревакцинацию через" не должно быть больше значения "Вакцинация действует в
                                        течение"
                                    </TextFootnoteBold>
                                </Flex>
                            )}
                        </> || props.values.kind !== VaccinationKind.ONCE && (
                            <FormDurationInputs className='mt-16' required={props.values.kind !== VaccinationKind.LAST}
                                                title='Рекомендовать следующую вакцинацию через' fieldName='next_vaccination_available_after'/>
                        )}

                        {[VaccinationGroup.NK, VaccinationGroup.KEP, VaccinationGroup.OTHER].includes(props.values.group!) && <>
                            <FormDurationInputs leftLabel='ОТ' className='mt-48' title='Рекомендуемый возраст для вакцинации'
                                                required={props.values.group === VaccinationGroup.NK}
                                                fieldName='recommended_age_from'/>
                            <FormDurationInputs leftLabel='ДО' fieldName='recommended_age_to'/>
                        </>}

                        <FormGender/>

                        <FormDiseasesRisk/>

                        <div>
                            <FastField name='enabled'
                                       label='Показывать в рекомендациях'
                                       component={FormCheckbox}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEnabledChange(e, props)}/>
                        </div>
                        <Flex alignItemsStart className='mt-32'>
                            <FastField name='interesting_fact' label='Интересный факт' component={FormInput}/>
                            <Icon className='ml-24 mt-16' name='doctor_face'/>
                        </Flex>

                        {props.values.group && <FieldsByGroup currentGroup={props.values.group}/>}

                        <Button className='mt-48' type='submit' loading={submitting} outlined
                                icon={(!vaccination || copyMode) && 'plus' || undefined}
                                content={(!vaccination || copyMode) && 'Создать вакцинацию' || 'Сохранить изменения'}/>
                    </div>
                </Form>}
            </Formik>
        </Grid>
    </>
}

export default VaccinationDetails
