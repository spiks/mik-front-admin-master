import { observable, action } from 'mobx'

export class GlobalStore {
    @observable hasUnreadSupportMessage = false

    @action setHasUnreadSupportMessage = (has: boolean) => this.hasUnreadSupportMessage = has
}

const globalStore = new GlobalStore()

export default globalStore
