import {computed, observable} from 'mobx'

import {ListStore} from 'stores/ListStore'
import api from 'services/ApiService'

import {ISupport, SupportListRequest} from '../interfaces/models'

export class SupportStore extends ListStore {
    @observable supportList: ISupport[] = []
    @computed get cursor(): string | undefined {
        return this.supportList[this.supportList.length - 1]?.created_at
    }

    fetchSupportList = async (params?: SupportListRequest) => {
        this.fetching = true
        this.supportList = []

        try {
            const res = await this.getSupportList(params)
            this.supportList = res.support_requests
            this.totalCount = res.total_count

            return res
        } finally {
            this.fetching = false
        }
    }

    loadMore = async (params?: SupportListRequest) => {
        try {
            const res = await this.getSupportList(params)

            this.supportList = [...this.supportList, ...res.support_requests]

            return res.support_requests.length
        } catch {
            return 0
        }
    }

    getSupportList = async (params?: SupportListRequest) =>
        await api.Support.list({
            cursor: params?.cursor || this.cursor,
            limit: params?.limit
        })
}

const supportStore = new SupportStore()

export default supportStore
