import * as React from 'react'
import {observer} from 'mobx-react'
import {Modal as ModalMaterial} from '@material-ui/core'
import {RouteComponentProps, withRouter} from 'react-router'

import {useStores} from 'stores/MobxProvider'

import Icon from '../icon/Icon'

const cx = require('classnames/bind').bind(require('./modal.scss'))

const Modal: React.FC<RouteComponentProps> = props => {
    const {openedModals, closeModal} = useStores().modalStore

    const usePrevious = (values: RouteComponentProps): RouteComponentProps | undefined => {
        const ref = React.useRef<RouteComponentProps>()

        React.useEffect(() => {
            ref.current = values
        })

        return ref.current
    }

    const prevLocation = usePrevious(props)

    React.useEffect(() => {
        if (prevLocation) {
            if (prevLocation.location.pathname !== props.location.pathname) {
                closeModal()
            }
        }
    })

    return <>
        {openedModals.map(({className, content, small, withCross = true}, idx) => (
            <ModalMaterial
                key={idx}
                aria-labelledby='modal-title'
                aria-describedby='modal-description'
                className={cx('modal-wrapper')}
                open
                disableBackdropClick
                disableEscapeKeyDown
                onClose={closeModal}
            >
                <div className={cx('modal', {small}, className)}>
                    {withCross && <Icon className={cx('close')} name='close' onClick={() => closeModal()}/>}
                    <div className={cx('content')}>
                        {content}
                    </div>
                </div>
            </ModalMaterial>
        ))}
    </>
}

export default withRouter(observer(Modal))
