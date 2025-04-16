import {AxiosError, AxiosResponse} from 'axios'

import notificationsStore from '../components/notifications/NotificationsStore'

export const excludeHandleURL = new Set<string | undefined>(['/profile/password'])

const CODE_WRONG_AUTH_CREDENTIALS = 'WrongAuthCredentials'

export class ErrorHandler {
    showResponseError = (error: AxiosError) => {
        if (!excludeHandleURL.has(error.response?.config.url)) {
            notificationsStore.addError(this.serverCodeToNotificationText(error.response?.data.code) || error.response?.data.message)
        }
    }

    serverCodeToNotificationText = (code: string) => {
        switch (code) {
            case CODE_WRONG_AUTH_CREDENTIALS:
                return 'Проверьте правильность ввода логина и пароля'
            default:
                return null
        }
    }
}

export const errorHandler = new ErrorHandler()
