import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import routes from 'routes'

import history from 'services/history'
import api from 'services/ApiService'

import {parseCsvFile} from 'common/utils/csv'
import Button from 'common/components/button/Button'
import Table from 'common/components/table/Table'
import Column from 'common/components/table/Column'
import ActionColumn from 'common/components/table/components/ActionColumn'
import modalStore from 'common/components/modal/ModalStore'
import DeleteConfirmationModal from 'common/components/modal/DeleteConfirmationModal'
import ImportCsvModal from 'common/components/modal/ImportCsvModal'
import Flex from 'common/components/flex/Flex'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import SearchTextField from 'common/components/inputs/SearchTextField'
import {TextBody} from 'common/components/text/Text'

import {DiseaseCreateRequest, IDiseaseShort} from './interfaces/models'

const cx = require('classnames/bind').bind(require('./styles/list.scss'))

const defaultPagination = {
    limit: 10,
    offset: 0
}

const Diseases: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(false)
    const [diseases, setDiseases] = useState<IDiseaseShort[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [pagination, setPagination] = useState<{limit: number, offset: number}>(defaultPagination)
    const [search, setSearch] = useState<string>('')

    const fetchDiseases = async () => {
        setFetching(true)
        setPagination(defaultPagination)

        try {
            const response = await api.Diseases.list({
                limit: defaultPagination.limit,
                offset: defaultPagination.offset,
                search: search
            })

            setTotalCount(response.total_count)
            setDiseases(response.diseases)
        } finally {
            setFetching(false)
        }
    }

    const loadMore = async () => {
        const nextOffset = pagination.offset + pagination.limit

        const response = await api.Diseases.list({
            limit: pagination.limit,
            offset: nextOffset,
            search: search
        })

        setDiseases([...diseases, ...response.diseases])
        setPagination({...pagination, offset: nextOffset})

        return response.diseases.length
    }

    const showImportCsvModal = () => {
        modalStore.openModal({
            content: <ImportCsvModal title='Импорт заболеваний из CSV'
                                     confirmText='Добавить заболевания'
                                     onConfirm={importCsv}/>
        })
    }

    const importCsv = async (file: File) => {
        try {
            const data = await parseCsvFile(file)
            const diseases: DiseaseCreateRequest[] = []

            for (let i = 1; i < data.length; i++) {
                const row = data[i]

                if (row.length === 3) {
                    const [name, description, risk] = [row[0].trim(), row[1].trim(), row[2].trim()]

                    if (!name.length) {
                        continue
                    } else if (!description.length) {
                        continue
                    }

                    diseases.push({
                        name: name,
                        description: description,
                        risk: risk === '+'
                    })
                }
            }

            if (diseases.length === 0) {
                notificationsStore.addError('Документ пустой или имеет неверный формат')
            } else {
                await api.Diseases.create(diseases)
                await fetchDiseases()
                notificationsStore.addSuccess('Заболевания добавлены в справочник')

                return true
            }
        } catch {
            notificationsStore.addError('Во время обработки файла возникла ошибка')
        }

        return false
    }

    useEffect(() => {
        (async () => await fetchDiseases())()
    }, [search])

    const actionColumn = (disease: IDiseaseShort) => {
        return <ActionColumn
            onEditClick={() => history.push(`${routes.referencesDiseaseDetails}?id=${disease.id}`)}
            onCloseClick={() => {
                modalStore.openModal({
                    content: <DeleteConfirmationModal
                        title='Удалить заболевание?'
                        onAccept={async () => {
                            await api.Diseases.delete(disease.id)
                            notificationsStore.addSuccess('Запись удалена')
                            await fetchDiseases()
                        }}
                    />,
                    small: true
                })
            }}
        />
    }

    const formatRisk = (disease: IDiseaseShort): JSX.Element => (
        <Flex justifyContentCenter className='flex-grow-1'>{disease.risk ? '✓' : '—'}</Flex>
    )

    const formatName = (disease: IDiseaseShort) => (
        <TextBody>
            <Link to={`${routes.referencesDiseaseDetails}?id=${disease.id}`}>{disease.name}</Link>
        </TextBody>
    )

    const formatDescription = (disease: IDiseaseShort) => {
        return <TextBody dangerouslySetInnerHTML={{__html: disease.description || ''}}/>
    }

    return <>
        <section className={cx('header-section')}>
            <div className={cx('total-count')}>Всего заболеваний: {totalCount}</div>

            <div className={cx('header')}>
                <Button className={cx('add')} icon='plus' content='Добавить заболевание'
                        onClick={() => history.push(routes.referencesDiseaseDetails)}/>
                <Button className={cx('import')} text content='Импорт заболеваний из CSV' onClick={showImportCsvModal}/>
                <SearchTextField className={cx('search')} onSetSearch={setSearch} placeholder='Найти заболевания по названию'/>
            </div>
        </section>

        <Table className='mt-50' source={diseases} isLoading={fetching} loadMore={loadMore}>
            <Column data={formatName} width='280px'>Название</Column>
            <Column data={formatDescription}>Описание заболевания</Column>
            <Column data={formatRisk} width='140px'>Группа риска</Column>
            <Column width='100px' data={actionColumn}/>
        </Table>
    </>
}

export default observer(Diseases)
