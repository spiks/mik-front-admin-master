import {observable, action, reaction} from 'mobx'

import routes from 'routes'
import {TokenStorage} from 'services/storage/TokenStorageService'
import {ProfileStorage} from 'services/storage/ProfileStorageService'
import api from 'services/ApiService'
import history from 'services/history'

import {IAuthStore} from 'common/modules/AuthTokenManager'

import {IProfile} from '../types/profile'
import {LoginRequest} from '../types/auth'

export class AuthStore implements IAuthStore {
    @observable accessToken = TokenStorage.getAccessToken()
    @observable refreshToken = TokenStorage.getRefreshToken()
    @observable profile: IProfile | null = ProfileStorage.getProfile()

    constructor() {
        reaction(
            () => ({
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                profile: this.profile
            }),
            ({accessToken, refreshToken, profile}) => {
                if (accessToken) {
                    TokenStorage.setAccessToken(accessToken)
                } else {
                    TokenStorage.removeAccessToken()
                }

                if (refreshToken) {
                    TokenStorage.setRefreshToken(refreshToken)
                } else {
                    TokenStorage.removeRefreshToken()
                }

                if (profile) {
                    ProfileStorage.setProfile(profile)
                } else {
                    ProfileStorage.removeProfile()
                }
            }
        )
    }

    @action login = async (data: LoginRequest) => {
        const result = await api.Auth.login(data)
        const {access_token, refresh_token, profile} = result

        this.accessToken = access_token
        this.refreshToken = refresh_token
        this.profile = profile

        history.push(routes.main)
    }

    @action setAccessToken = (token: string) => this.accessToken = token

    @action setRefreshToken = (token: string) => this.refreshToken = token

    @action reset = () => {
        this.accessToken = null
        this.refreshToken = null
        this.profile = null
    }

    getAccessToken = () => this.accessToken

    getRefreshToken = () => this.refreshToken
}

const authStore = new AuthStore()

export default authStore
