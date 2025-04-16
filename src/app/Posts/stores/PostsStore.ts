import {computed, observable} from 'mobx'

import {ListStore} from 'stores/ListStore'
import api from 'services/ApiService'

import {IPostShort, PostsRequest} from '../interfaces/models'

export class PostsStore extends ListStore {
    @observable posts: IPostShort[] = []
    @computed get cursor(): string | undefined {
        return this.posts[this.posts.length - 1]?.created_at
    }

    fetchPosts = async (params?: PostsRequest) => {
        this.fetching = true
        this.posts = []

        try {
            const res = await this.getPostsList(params)
            this.posts = res.posts
            this.totalCount = res.total_count

            return res
        } finally {
            this.fetching = false
        }
    }

    loadMore = async (params?: PostsRequest) => {
        try {
            const res = await this.getPostsList(params)

            this.posts = [...this.posts, ...res.posts]

            return res.posts.length
        } catch {
            return 0
        }
    }

    getPostsList = async (params?: PostsRequest) =>
        await api.Posts.list({
            search: params?.search || undefined,
            cursor: params?.cursor || this.cursor,
            limit: params?.limit
        })
}

const postsStore = new PostsStore()

export default postsStore
