import {action, observable} from 'mobx'

export class ListStore {
    @observable fetching = false
    @observable totalCount = 0

    @action setTotalCount = (totalCount: number) => this.totalCount = totalCount
    @action setFetching = (fetching: boolean) => this.fetching = fetching
}
