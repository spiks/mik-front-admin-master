import {action, observable} from 'mobx'
import {IUser, UsersRequest} from '../interfaces/models'
import api from 'services/ApiService'

export class UsersStore {
    @observable users: IUser[] = []
    @observable fetching = false
    @observable totalCount = 0

    @action setUsers = (users: IUser[]) => this.users = users
    @action setTotalCount = (totalCount: number) => this.totalCount = totalCount
    @action setFetching = (fetching: boolean) => this.fetching = fetching

    fetchUsers = async (params?: UsersRequest) => {
        this.fetching = true

        try {
            const res = await api.Users.list({search: params?.search || undefined, roles: params?.roles || undefined})
            this.users = res.users
            this.totalCount = res.total_count

            return res
        } finally {
            this.fetching = false
        }
    }
}

const usersStore = new UsersStore()

export default usersStore
