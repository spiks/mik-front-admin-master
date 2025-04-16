import {computed, observable} from 'mobx'
import uniqBy from 'lodash/uniqBy'

import api from 'services/ApiService'

import {ISupportMessage, SupportMessagesRequest} from '../interfaces/models'
import {ISupportTopicShort} from '../../References/SupportTopics/interfaces/models'

export class SupportMessagesStore {
    @observable supportMessages: ISupportMessage[] = []
    @observable requestId: string
    @observable lastTopic: ISupportTopicShort | null

    @computed get before(): string | undefined {
        return this.supportMessages.length && this.supportMessages[0]?.created_at || undefined
    }
    @computed get after(): string | undefined {
        return this.supportMessages.length && this.supportMessages[this.supportMessages.length - 1]?.created_at || undefined
    }

    fetchMessages = async (requestId?: string) => {
        if (requestId) {
            this.requestId = requestId
            this.supportMessages = []
        }

        const result = await this.getMessages({after: this.after})
        this.supportMessages = uniqBy([...this.supportMessages, ...result.messages], 'id')
    }

    loadMore = async (requestId: string | null) => {
        if (requestId && !this.requestId) {
            this.requestId = requestId
        }

        try {
            const res = await this.getMessages({before: this.before})

            this.supportMessages.unshift(...res.messages)

            return res.messages.length
        } catch {
            return 0
        }
    }

    getMessages = async (params?: SupportMessagesRequest) =>
        await api.SupportMessages.list(this.requestId, {
            limit: params?.limit,
            after: params?.after,
            before: params?.before
        })
}

const supportMessagesStore = new SupportMessagesStore()

export default supportMessagesStore
