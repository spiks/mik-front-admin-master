import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import routes from 'routes'

import history from 'services/history'
import api from 'services/ApiService'

import Button from 'common/components/button/Button'
import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import SearchTextField from 'common/components/inputs/SearchTextField'
import Grid from 'common/components/grid/Grid'
import {TextBody} from 'common/components/text/Text'

import {ICountryShort} from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/list.scss'))

const Countries: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [countries, setCountries] = useState<ICountryShort[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    const fetchCountries = async () => {
        setFetching(true)

        try {
            const response = await api.Countries.list({search})

            setTotalCount(response.total_count)
            setCountries(response.countries)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchCountries())()
    }, [search])

    const actionColumn = (country: ICountryShort) => {
        return <ActionColumn
            onEditClick={() => history.push(`${routes.referencesCountryDetails}?id=${country.id}`)}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить страну?'
                        onAccept={async () => {
                            await api.Countries.delete(country.id)
                            notificationsStore.addSuccess('Запись удалена')
                            await fetchCountries()
                        }}
                    />,
                    small: true
                })
            }}
        />
    }

    const formatName = (country: ICountryShort) => (
        <TextBody>
            <Link to={`${routes.referencesCountryDetails}?id=${country.id}`}>{country.name}</Link>
        </TextBody>
    )

    const formatDescription = (country: ICountryShort) => {
        return <TextBody dangerouslySetInnerHTML={{__html: country.description || ''}}/>
    }

    return <>
        <section className={cx('header-section')}>
            <div className={cx('total-count')}>Всего стран: {totalCount}</div>

            <Grid templateColumns='203px auto 478px' style={{gridTemplateAreas: '"button . search"'}} alignItemsCenter>
                <Button className={cx('add')}
                        style={{gridArea: 'button'}}
                        icon='plus'
                        content='Добавить страну'
                        onClick={() => history.push(routes.referencesCountryDetails)}/>

                <SearchTextField style={{gridArea: 'search'}}
                                 className={cx('search')}
                                 onSetSearch={setSearch}
                                 placeholder='Найти страну по названию'/>
            </Grid>
        </section>

        <Table className='mt-50' source={countries} isLoading={fetching}>
            <Column data={formatName} width='280px'>Название</Column>
            <Column data={formatDescription}>Описание</Column>
            <Column width='100px' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Countries)
