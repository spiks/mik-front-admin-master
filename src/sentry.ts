import * as Sentry from '@sentry/browser'
import {AxiosError} from 'axios'

export default (function() {
    if (!process.env.SENTRY_ENV) {
        throw Error('Sentry env must be set')
    }

    Sentry.init({
        dsn: 'https://139da8dbdbc14efba562d7bfc7659ab1@sentry.kode-t.ru/28',
        environment: process.env.SENTRY_ENV,
        enabled: process.env.SENTRY_ENV !== 'local',
        release: `stmx_front@${process.env.APP_VERSION}`.trim(),
        attachStacktrace: true,
        beforeSend(event, hint?) {
            const exception: AxiosError | null = hint?.originalException as AxiosError

            if (exception) {
                event.extra = {
                    requestBody: exception.config?.data,
                    responseData: exception.request?.response,
                    'x-request-id': exception.response?.headers['x-request-id']
                }
            }

            return event
        }
    })
}())
