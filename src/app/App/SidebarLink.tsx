import * as React from 'react'
import {NavLink} from 'react-router-dom'

import {TextBodyBold, TextH2} from 'common/components/text/Text'

const cx = require('classnames/bind').bind(require('./styles/layout.scss'))

interface Props {
    to: string
    className?: string
    exact?: boolean
}

const SidebarLink: React.FC<Props> = props => {
    return <NavLink exact={props.exact} to={props.to} activeClassName={cx('link-active')} className={cx('link', props.className)}>
        <TextBodyBold>{props.children}</TextBodyBold>
    </NavLink>
}

export default SidebarLink
