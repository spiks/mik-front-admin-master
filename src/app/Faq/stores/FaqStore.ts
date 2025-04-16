import {action, observable} from 'mobx'

import api from 'services/ApiService'
import {ListStore} from 'stores/ListStore'

import {IFaq} from '../interfaces/models'

export class FaqStore extends ListStore {
    @observable faqList: IFaq[] = []

    @action setFaqList = (faqList: IFaq[]) => this.faqList = faqList

    fetchFaqList = async () => {
        this.fetching = true

        try {
            const res = await api.Faq.list()
            this.faqList = res.faqs
            this.totalCount = this.faqList.length

            return res
        } finally {
            this.fetching = false
        }
    }
}

const faqStore = new FaqStore()

export default faqStore
