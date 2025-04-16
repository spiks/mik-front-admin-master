import * as React from 'react'
import ReactNotifications from 'react-notification-system'
import {autorun} from 'mobx'
import {observer} from 'mobx-react'

import {useStores} from 'stores/MobxProvider'

const Notifications: React.FC = () => {
    const {notificationsStore} = useStores()
    const notificationSystem = React.useRef<any>(null)

    React.useEffect(() => {
        autorun(() => {
            const {notification, clearNotification} = notificationsStore

            if (notification !== null && notificationSystem.current) {
                notificationSystem.current.addNotification(notification)

                clearNotification()
            }
        })
    }, [])

    return <ReactNotifications
        ref={notificationSystem}
        allowHTML
        style={{
            Containers: {
                DefaultStyle: {
                    width: 720
                }
            },
            NotificationItem: {
                DefaultStyle: {
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#3A3A3A',
                    padding: '16px 18px',
                    height: 'initial',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0px auto 0px -160px'
                }
            },
            Title: {
                DefaultStyle: {
                    fontSize: 14,
                    lineHeight: '21px',
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: '#101318'
                }
            },
            MessageWrapper: {
                DefaultStyle: {
                    fontSize: 16,
                    lineHeight: '24px',
                    fontWeight: 'bold',
                    color: '#FFF',
                    order: 2
                }
            },
            Dismiss: {
                DefaultStyle: {
                    backgroundColor: 'transparent',
                    width: '24px',
                    height: '24px',
                    fontSize: '24px',
                    lineHeight: '24px',
                    top: 0,
                    bottom: 0,
                    right: 22,
                    margin: 'auto',
                    color: '#797676'
                }
            }
        }}
    />
}

export default observer(Notifications)
