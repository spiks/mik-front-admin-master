export class StorageService {
    protected storage = window.localStorage

    get = (key: string) => this.storage.getItem(key)

    set = (key: string, value: any) => this.storage.setItem(key, value)

    remove = (key: string) => this.storage.removeItem(key)
}

const localStorage = new StorageService()

export default localStorage
