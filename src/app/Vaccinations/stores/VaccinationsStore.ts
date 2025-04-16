import {action, observable} from 'mobx'
import api from 'services/ApiService'
import {ListStore} from 'stores/ListStore'
import {IVaccinationList, VaccinationsRequest} from '../interfaces/models'

export class VaccinationsStore extends ListStore {
    @observable vaccinations: IVaccinationList[] = []
    @observable pagination = {
        limit: 10,
        offset: 0
    }

    fetch = async (params?: VaccinationsRequest) => {
        this.fetching = true

        try {
            const res = await api.Vaccinations.list({search: params?.search || undefined, groups: params?.groups || undefined})
            this.vaccinations = res.vaccinations
            this.totalCount = res.total_count

            return res
        } finally {
            this.fetching = false
        }
    }

    loadMore = async (params?: VaccinationsRequest) => {
        const nextOffset = this.pagination.offset + this.pagination.limit

        const response = await api.Vaccinations.list({
            limit: this.pagination.limit,
            offset: nextOffset,
            search: params?.search || undefined,
            groups: params?.groups || undefined
        })

        this.vaccinations = [...this.vaccinations, ...response.vaccinations]

        this.pagination.offset = nextOffset

        return response.vaccinations.length
    }

    resetPagination = () => {
        this.pagination = {
            limit: 10,
            offset: 0
        }
    }
}

const vaccinationsStore = new VaccinationsStore()

export default vaccinationsStore
