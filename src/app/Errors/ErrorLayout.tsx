import * as React from 'react'

import routes from 'routes'

import Flex from 'common/components/flex/Flex'
import Button from 'common/components/button/Button'
import {Link} from 'react-router-dom'

const cx = require('classnames/bind').bind(require('./styles/errors.scss'))

interface Props {
    title: React.ReactNode
    subtitle: React.ReactNode
    actionText?: string
    actionLink?: string
    onClickAction?: () => void
    className?: string
}

const defaultProps: Partial<Props> = {
    actionText: 'На главную',
    actionLink: routes.main
}

const ErrorLayout: React.FC<Props> = props => {
    const {title, subtitle, actionText, actionLink, className, onClickAction} = props

    return <Flex alignItemsCenter justifyContentCenter className={cx('wrapper', className)}>
        <Flex column alignItemsCenter>
            {title}
            {subtitle}
            <Link onClick={onClickAction} className={cx('action-link')} to={actionLink!}>
                <Button className={cx('action')}>
                    <div className={cx('action-text')}>{actionText}</div>
                </Button>
            </Link>
        </Flex>
    </Flex>
}

ErrorLayout.defaultProps = defaultProps

export default ErrorLayout
