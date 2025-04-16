import {StorageService} from './StorageService'

class TokenStorageService extends StorageService {
    accessTokenKey = 'access_token'
    refreshTokenKey = 'refresh_token'

    setAccessToken = (token: string) => this.set(this.accessTokenKey, token)

    getAccessToken = () => this.get(this.accessTokenKey)

    removeAccessToken = () => this.remove(this.accessTokenKey)

    setRefreshToken = (token: string) => this.set(this.refreshTokenKey, token)

    getRefreshToken = () => this.get(this.refreshTokenKey)

    removeRefreshToken = () => this.remove(this.refreshTokenKey)
}

export const TokenStorage = new TokenStorageService()
