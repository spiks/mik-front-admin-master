import axios, {AxiosResponse} from 'axios'

export interface IAuthStore {
    setAccessToken: (token: string) => void
    setRefreshToken: (token: string) => void
    getAccessToken: () => string | null
    getRefreshToken: () => string | null
    reset: () => void
}

interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
}

interface Config {
    authStore: IAuthStore
    redirectOnAuthPage: () => void
    refreshTokenRequest: (refreshToken: string | null) => Promise<RefreshTokenResponse>
}

type RequestRetryCallback = (access_token: string) => void

export default class AuthTokenManager {
    private readonly config: Config

    private tokenRefreshed = false
    private callbacksQueue: RequestRetryCallback[] = []

    constructor(config: Config) {
        this.config = config
    }

    isAnyTokenExpired = (response: AxiosResponse) => {
        return this.isTokenExpired(response) || this.isTokenExpired(response, 'refresh')
    }

    handleTokensExpired = (response: AxiosResponse) => {
        if (this.isTokenExpired(response)) {
            return this.resetTokenAndReattemptRequest(response)
        }

        if (this.isTokenExpired(response, 'refresh')) {
            this.handleRefreshTokenExpired()
        }
    }

    private resetTokenAndReattemptRequest = (errorResponse: AxiosResponse): Promise<any> => {
        const {authStore, redirectOnAuthPage, refreshTokenRequest} = this.config

        const refreshToken = authStore.getRefreshToken()

        if (!refreshToken) {
            redirectOnAuthPage()
        }

        const retryOriginalRequest = new Promise<any>(resolve => {
            this.addCallbackToQueue(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token
                resolve(axios(errorResponse.config))
            })
        })

        if (!this.tokenRefreshed) {
            this.tokenRefreshed = true

            refreshTokenRequest(refreshToken)
                .then(res => {
                    authStore.setAccessToken(res.access_token)
                    authStore.setRefreshToken(res.refresh_token)
                    this.onAccessTokenFetched(res.access_token)
                })
                .catch(error => {
                    if (this.isTokenExpired(error.response, 'refresh')) {
                        this.handleRefreshTokenExpired()
                    } else {
                        redirectOnAuthPage()
                        return Promise.reject(error)
                    }
                })
                .finally(() => {
                    this.tokenRefreshed = false
                })
        }

        return retryOriginalRequest
    }

    private handleRefreshTokenExpired = () => {
        const {authStore, redirectOnAuthPage} = this.config

        authStore.reset()
        redirectOnAuthPage()
    }

    private isTokenExpired = (response: AxiosResponse, tokenType: 'access' | 'refresh' = 'access'): boolean =>
        response.data !== undefined
        && response.status === 401
        && (response.data.code === 'Unauthorized' || response.data.code === (tokenType === 'access' ? 'AccessTokenExpired' : 'RefreshTokenExpired'))

    private addCallbackToQueue = (callback: RequestRetryCallback) => this.callbacksQueue.push(callback)

    private onAccessTokenFetched = (access_token: string) => {
        // When the refresh is successful, we start retrying the requests one by one and empty the queue
        this.callbacksQueue.forEach(callback => callback(access_token))
        this.callbacksQueue = []
    }
}
