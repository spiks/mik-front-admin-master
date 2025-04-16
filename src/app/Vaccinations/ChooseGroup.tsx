import React from 'react'

import Grid from 'common/components/grid/Grid'
import {TextBody, TextH1, TextH2} from 'common/components/text/Text'
import Flex from 'common/components/flex/Flex'
import {VaccinationGroup} from './interfaces/models'
import modalStore from 'common/components/modal/ModalStore'
import ConfirmationModal from 'common/components/modal/ConfirmationModal'
import {useFormikContext} from 'formik'
import {VaccinationFormValues} from './helpers/data'

const cx = require('classnames/bind').bind(require('./styles/choose-group.scss'))

interface Props {
    activeGroup: VaccinationGroup | null
    onClick: (group: VaccinationGroup) => void
    disabled: boolean
}

const groupCells = [
    {
        group: VaccinationGroup.NK,
        label: 'Национальный календарь'
    },
    {
        group: VaccinationGroup.KEP,
        label: 'По эпидемическим показаниям 😷'
    },
    {
        group: VaccinationGroup.TS,
        label: 'Туристический календарь ✈️'
    },
    {
        group: VaccinationGroup.OTHER,
        label: 'Другие прививки 💉'
    }
]

const ChooseGroup: React.FC<Props> = ({activeGroup, onClick, disabled}) => {
    const {resetForm, touched} = useFormikContext<VaccinationFormValues>()

    return <>
        <TextBody>Шаг 1</TextBody>
        <TextH1>Выберите календарь</TextH1>
        <Grid className='mt-32' templateColumns='1fr 1fr' templateRows='96px 96px' style={{gap: 8}}>
            {groupCells.map((cell, index) => (
                <Flex key={index} centered className={cx('group-cell', 'pointer', {active: cell.group === activeGroup, disabled})}
                      onClick={() => {
                          if (activeGroup !== cell.group && Object.keys(touched).length !== 0) {
                              modalStore.openModal({
                                  content: <ConfirmationModal
                                      redButtons
                                      title='Несохраненные данные формы будут потеряны!'
                                      acceptButtonText='Продолжить' cancelButtonText='Отмена'
                                      onAccept={async () => {
                                          resetForm()
                                          await onClick(cell.group)}}/>,
                                  small: true,
                                  withCross: false
                              })
                          } else {
                              onClick(cell.group)
                          }
                      }}>
                    <TextH2 className={cx('label', {ru: cell.group === VaccinationGroup.NK})}>{cell.label}</TextH2>
                </Flex>
            ))}
        </Grid>
    </>
}

export default ChooseGroup
