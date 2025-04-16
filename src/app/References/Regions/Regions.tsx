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

import {IRegionShort} from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/list.scss'))

const Regions: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [regions, setRegions] = useState<IRegionShort[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    const fetchRegions = async () => {
        setFetching(true)

        try {
            const response = await api.Regions.list({search})

            setTotalCount(response.total_count)
            setRegions(response.regions)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        (async () => await fetchRegions())()
    }, [search])

    const actionColumn = (region: IRegionShort) => {
        return <ActionColumn
            onEditClick={() => history.push(`${routes.referencesRegionDetails}?id=${region.id}`)}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить регион проживания?'
                        onAccept={async () => {
                            await api.Regions.delete(region.id)
                            notificationsStore.addSuccess('Запись удалена')
                            await fetchRegions()
                        }}
                    />,
                    small: true
                })
            }}
        />
    }

    const formatName = (region: IRegionShort) => (
        <TextBody>
            <Link to={`${routes.referencesRegionDetails}?id=${region.id}`}>{region.name}</Link>
        </TextBody>
    )

    const formatDescription = (region: IRegionShort) => {
        return <TextBody dangerouslySetInnerHTML={{__html: region.description || ''}}/>
    }

    return <>
        <section className={cx('header-section')}>
            <div className={cx('total-count')}>Всего регионов: {totalCount}</div>

            <Grid templateColumns='319px auto 478px' style={{gridTemplateAreas: '"button . search"'}} alignItemsCenter>
                <Button className={cx('add')}
                        style={{gridArea: 'button'}}
                        icon='plus'
                        content='Добавить регион проживания'
                        onClick={() => history.push(routes.referencesRegionDetails)}/>

                <SearchTextField style={{gridArea: 'search'}}
                                 className={cx('search')}
                                 onSetSearch={setSearch}
                                 placeholder='Найти регион по названию'/>
            </Grid>
        </section>

        <Table className='mt-50' source={regions} isLoading={fetching}>
            <Column data={formatName} width='280px'>Название</Column>
            <Column data={formatDescription}>Описание</Column>
            <Column width='100px' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Regions)
