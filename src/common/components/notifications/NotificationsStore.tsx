import * as React from 'react'
import {observable, action} from 'mobx'
import {Notification} from 'react-notification-system'

import Icon from 'common/components/icon/Icon'

const cx = require('classnames/bind').bind(require('./styles/styles.scss'))

export class NotificationsStore {
    @observable notification: Notification | null = null

    @action addNotification = (notification: Notification) => {
        this.notification = notification
    }

    @action clearNotification = () => {
        this.notification = null
    }

    public addError = (message = `На сервере произошла ошибка.\n Попробуйте снова.`) => {
        this.addNotification({
            message,
            level: 'error',
            autoDismiss: 5,
            position: 'bc',
            dismissible: true,
            children: (<Icon name='snack-error' className={cx('icon', 'error')} />)
        })
    }

    public addSuccess = (message?: string, dismissTimer = 5) => {
        this.addNotification({
            message,
            level: 'success',
            autoDismiss: dismissTimer,
            position: 'bc',
            dismissible: true,
            children: (<Icon name='snack-success' className={cx('icon', 'success')} />)
        })
    }

    public addInfo = (message?: string, dismissTimer = 5) => {
        this.addNotification({
            message,
            level: 'info',
            autoDismiss: dismissTimer,
            position: 'bc',
            dismissible: true,
            children: (<Icon name='snack-info' className={cx('icon', 'info')} />)
        })
    }
}

const notificationsStore = new NotificationsStore()

export default notificationsStore
