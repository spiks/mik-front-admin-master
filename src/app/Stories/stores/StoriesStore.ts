import {action, computed, observable} from 'mobx'

import {ListStore} from 'stores/ListStore'
import api from 'services/ApiService'

import {IStoryShort, StoriesRequest} from '../interfaces/stories'

export class StoriesStore extends ListStore {
    @observable stories: IStoryShort[] = []
    @computed get cursor(): string | undefined {
        return this.stories[this.stories.length - 1]?.created_at
    }

    @action setStories = (stories: IStoryShort[]) => this.stories = stories

    fetch = async (params?: StoriesRequest) => {
        this.fetching = true

        try {
            const res = await this.getStoriesList(params)
            this.stories = res.stories
            this.totalCount = res.total_count

            return res
        } finally {
            this.fetching = false
        }
    }

    loadMore = async (params?: StoriesRequest) => {
        try {
            const res = await this.getStoriesList(params)

            this.stories = [...this.stories, ...res.stories]

            return res.stories.length
        } catch {
            return 0
        }
    }

    refreshList = async (params?: StoriesRequest) => {
        this.stories = []

        await this.fetch(params)
    }

    getStoriesList = async (params?: StoriesRequest) =>
        await api.Stories.list({
            search: params?.search || undefined,
            cursor: params?.cursor || this.cursor,
            limit: params?.limit
        })
}

const storiesStore = new StoriesStore()

export default storiesStore
