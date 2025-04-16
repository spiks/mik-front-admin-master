import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import api from 'services/ApiService'
import {useStores} from 'stores/MobxProvider'
import history from 'services/history'
import routes from 'routes'

import PageHeader from 'common/components/layout/PageHeader'
import PageTitle from 'common/components/layout/PageTitle'
import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import SearchTextField from 'common/components/inputs/SearchTextField'
import CheckboxesGroup, {CheckboxGroupItem} from 'common/components/checkbox/CheckboxesGroup'
import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import {formatDaysDeclension, formatYearDeclension} from 'common/utils/declensions'
import {TextBody} from 'common/components/text/Text'

import {IVaccinationList, VaccinationGroup} from './interfaces/models'
import {durationToDatesEntities} from './helpers/formatters'

const checkboxes: CheckboxGroupItem<VaccinationGroup>[] = [
    {
        label: 'Национальный',
        value: VaccinationGroup.NK
    },
    {
        label: 'По эпидемическим показаниям',
        value: VaccinationGroup.KEP
    },
    {
        label: 'Туристический',
        value: VaccinationGroup.TS
    },
    {
        label: 'Другие прививки',
        value: VaccinationGroup.OTHER
    }
]

const Vaccinations: React.FC = () => {
    const {vaccinations, totalCount, fetching, fetch, loadMore, resetPagination} = useStores().vaccinationsStore

    const [search, setSearch] = useState('')
    const [groups, setGroups] = useState<VaccinationGroup[]>([])

    useEffect(() => {
        (async () => await fetch({search, groups}))()

        return resetPagination
    }, [groups, search])

    const actionColumn = (vaccination: IVaccinationList) => {
        return <ActionColumn
            copyTooltipText='Скопировать вакцинацию'
            onCopyClick={() => {
                history.push(`${routes.vaccinationDetails}?vaccination_id=${vaccination.id}&copy=true`)
            }}
            onEditClick={() => {
                history.push(`${routes.vaccinationDetails}?vaccination_id=${vaccination.id}`)
            }}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить вакцинацию?'
                        onAccept={async () => {
                            await api.Vaccinations.delete(vaccination.id)
                            notificationsStore.addSuccess(`Вакцинация удалена`)
                            await fetch({search, groups})
                        }}
                    />,
                    small: true
                })
            }}
        />
    }

    const formatCalendar = (vaccination: IVaccinationList) => {
        switch (vaccination.group) {
            case VaccinationGroup.NK:
                return 'Национальный'
            case VaccinationGroup.TS:
                return 'Туристический'
            case VaccinationGroup.KEP:
                return 'По эпидемическим показаниям'
            case VaccinationGroup.OTHER:
                return 'Другие прививки'
            default:
                return 'Неизвестный'
        }
    }

    const formatDistance = (vaccination: IVaccinationList) => {
        const {years, months, days} = durationToDatesEntities(vaccination.duration)

        let result = ''

        if (years) {
            result += `${years} ${formatYearDeclension(years).toLocaleLowerCase()} `
        }

        if (months) {
            result += `${months} мес `
        }

        if (days) {
            result += `${days} ${formatDaysDeclension(days).toLocaleLowerCase()}`
        }

        return result
    }

    const formatRisk = (vaccination: IVaccinationList): JSX.Element => (
        <Flex justifyContentCenter className='flex-grow-1'>{vaccination.diseases_risk ? '✓' : '—'}</Flex>
    )

    const formatEnabled = (vaccination: IVaccinationList): JSX.Element => (
        <Flex justifyContentCenter className='flex-grow-1'>{vaccination.enabled ? '✓' : '—'}</Flex>
    )

    const formatNameDisplay = (vaccination: IVaccinationList) => (
        <TextBody>
            <Link to={`${routes.vaccinationDetails}?vaccination_id=${vaccination.id}`}>{vaccination.name_display}</Link>
        </TextBody>
    )

    return <>
        <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Вакцинации' subtitle={`Всего вакцинаций: ${totalCount}`}/>
                <Button className='ml-24' icon='plus' content='Добавить вакцинацию' onClick={() => history.push(routes.vaccinationDetails)}/>
            </Flex>
            <SearchTextField onSetSearch={setSearch} placeholder='Найти вакцинацию по названию'/>
        </PageHeader>

        <CheckboxesGroup className='mt-48' title='Показывать по типу календаря:' values={checkboxes} checked={groups} onCheck={setGroups}/>

        <Table className='mt-32' source={vaccinations} isLoading={fetching} loadMore={() => loadMore({search, groups})}>
            <Column width='280px' data={formatNameDisplay}>Название</Column>
            <Column width='112px' data='order'>Порядк. номер</Column>
            <Column width='196px' data={formatCalendar}>Календарь</Column>
            <Column width='144px' data={formatDistance}>Срок годности</Column>
            <Column data={formatRisk} width='92px'>Группа риска</Column>
            <Column data={formatEnabled} width='159px'>Показывать в рекомендациях</Column>
            <Column width='calc(100% - 280px - 112px - 196px - 144px - 92px - 159px)' cellClassName='justify-content-end' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Vaccinations)
