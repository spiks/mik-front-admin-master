import React from 'react'
import {useHistory} from 'react-router'
import TabComponent, {TabProps} from '@material-ui/core/Tab'

import {TextButton} from '../text/Text'
import Flex from '../flex/Flex'

const cx = require('classnames/bind').bind(require('./styles/styles.scss'))

interface Props {
    href?: string
    icon?: JSX.Element
}

const Tab: React.FC<TabProps & Props> = props => {
    const {label, href, icon, ...rest} = props

    const {push} = useHistory()

    return <TabComponent
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            event.preventDefault()

            if (href) {
                push(href)
            }
        }}
        classes={{
            root: cx('tab'),
            selected: cx('tab-selected')
        }}
        label={label}
        {...rest}/>
}

export default Tab
