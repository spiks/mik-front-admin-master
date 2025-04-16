import axios, {AxiosResponse, AxiosError} from 'axios'

import history from 'services/history'
import api from 'services/ApiService'

import routes from 'routes'

import authStore from 'app/Auth/stores/AuthStore'

import {errorHandler} from 'common/modules/ErrorHandler'
import notificationsStore from 'common/components/notifications/NotificationsStore'
import AuthTokenManager from 'common/modules/AuthTokenManager'

const excludeNoResponseURL = new Set<string | undefined>(['/support/check-unread'])

const authTokenManager = new AuthTokenManager({
    authStore,
    redirectOnAuthPage: () => history.push(routes.auth),
    refreshTokenRequest: api.Auth.refresh
})

const checkNetwork = () => navigator.onLine

const repeatRequest = () => {
    return new Promise(function (resolve) {
        if (!checkNetwork()) {
            const numberOfRepetitions = 3
            let count = 1

            notificationsStore.addError(`[1/${numberOfRepetitions}] Отсутствует доступ в интернет. Повторный запрос через 5 сек.`)

            const interval = setInterval(function () {
                count += 1

                if (!checkNetwork()) {
                    if (count === numberOfRepetitions) {
                        notificationsStore.addError(`[${count}/${numberOfRepetitions}] Отсутствует доступ в интернет. Повторите попытку позднее.`)
                        clearInterval(interval)
                        resolve(false)
                    } else {
                        notificationsStore.addError(`[${count}/${numberOfRepetitions}] Отсутствует доступ в интернет. Повторный запрос через 5 сек.`)
                    }
                } else {
                    clearInterval(interval)
                    resolve(true)
                }
            }, 5000)
        } else {
            resolve(true)
        }
    })
}

export default (function () {
    axios.defaults.baseURL = process.env.SERVICE_URL

    axios.interceptors.request.use( (config) => {
        if (authStore.accessToken) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }

        return repeatRequest().then(result => {
            return {
                ...config,
                cancelToken: result ? undefined : new axios.CancelToken((cancel) => cancel('Cancel repeated request'))
            }
        })
    })

    axios.interceptors.response.use((response: AxiosResponse): any => response, (error: AxiosError) => {
        if (axios.isCancel(error)) {
            return
        }

        if (!error.response) {
            if (!excludeNoResponseURL.has(error?.config?.url)) {
                notificationsStore.addError('Ошибка сети или отсутствует доступ в интернет.')
            }

            return Promise.reject(error)
        } else {
            if (authTokenManager.isAnyTokenExpired(error.response)) {
                return authTokenManager.handleTokensExpired(error.response)
            }

            errorHandler.showResponseError(error)

            return Promise.reject(error)
        }
    })
}())
