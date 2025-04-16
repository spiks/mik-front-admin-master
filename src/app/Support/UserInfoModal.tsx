import React, {useEffect, useState} from 'react'
import api from 'services/ApiService'

import {IMessageClientSnapshotUser} from './interfaces/models'
import Loader from 'common/components/loader/Loader'
import {TextH1} from 'common/components/text/Text'
import Grid from 'common/components/grid/Grid'
import {DATE_FORMAT_WITH_LOCALIZED_MONTH, formatDate} from 'common/utils/dates'

import UserInfoBlock from './UserInfoBlock'
import {VaccinationGender} from '../Vaccinations/interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/support-messages.scss'))

interface Props {
    requestId: string
    messageId: string
}

const formatGender = (gender: VaccinationGender) => gender === VaccinationGender.FEMALE && 'Женщина' || 'Мужчина'

const formatOptionalArrayValues = (values?: string[]) => values?.join(`\n`)

const formatRegionsOrCountries = (items?: {name: string, trip_at: string}[]) => items?.map(item => `${item.name}, ${formatDate(item.trip_at, DATE_FORMAT_WITH_LOCALIZED_MONTH)}`).join(`\n`)

const formatVaccinations = (items?: {name: string, vaccinated_at: string}[]) => items?.map(item => `${item.name}, ${formatDate(item.vaccinated_at, DATE_FORMAT_WITH_LOCALIZED_MONTH)}`).join(`\n`)

const UserInfoModal: React.FC<Props> = ({requestId, messageId}) => {
    const [fetching, setFetching] = useState(true)
    const [users, setUsers] = useState<IMessageClientSnapshotUser[]>([])

    useEffect(() => {
        (async () => {
            try {
                const res = await api.SupportMessages.client_snapshot(requestId, messageId)
                setUsers(res.client_snapshot?.users || [])
                setFetching(false)
            } catch {
                setFetching(false)
            }
        })()
    }, [])

    if (fetching) {
        return <Loader/>
    } else if (!users.length) {
        return <div>Нет данных о пользователях клиента</div>
    }

    return (
        <>
            <TextH1>Клиент и члены семьи</TextH1>
            {users.map((user, index) => {
                return (
                    <Grid key={index} templateColumns='1fr 1fr 1fr' className={cx('user-info')} style={{gap: 32}}>
                        <UserInfoBlock title='Пол' content={formatGender(user.gender)}/>
                        <UserInfoBlock title='Дата рождения' content={formatDate(user.birthday, DATE_FORMAT_WITH_LOCALIZED_MONTH)}/>
                        <UserInfoBlock title='Группы риска' content={formatOptionalArrayValues(user.diseases_risk)}/>
                        <UserInfoBlock title='Сферы работы' content={formatOptionalArrayValues(user.activities)}/>
                        <UserInfoBlock title='Хобби' content={formatOptionalArrayValues(user.hobbies)}/>
                        <UserInfoBlock title='Регион проживания' content={user.residence_region?.name}/>
                        <UserInfoBlock style={{gridColumn: 'span 3'}} title='Проставленные вакцины' content={formatVaccinations(user.vaccinations)}/>
                        <UserInfoBlock style={{gridColumn: 'span 3'}} title='Запланированные поездки'
                                       content={formatRegionsOrCountries(user.countries)?.concat(formatRegionsOrCountries(user.regions) || '')}/>
                    </Grid>
                )
            })}
        </>
    )
}

export default UserInfoModal
