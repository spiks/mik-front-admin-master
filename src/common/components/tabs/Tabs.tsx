import React from 'react'
import TabsComponent from '@material-ui/core/Tabs'

interface Props {
    value: number
    className?: string
    onChange?: (event: React.ChangeEvent<{}>, value: number) => void
}

const cx = require('classnames/bind').bind(require('./styles/styles.scss'))

const Tabs: React.FC<Props> = props => {
    const {children, ...rest} = props

    return <TabsComponent
        // recalculate tabs underline width on mount
        action={(actions) => actions && setTimeout(actions.updateIndicator.bind(actions), 0)}
        classes={{
            indicator: cx('indicator'),
            root: cx('root')
        }} {...rest}>{children}</TabsComponent>
}

export default Tabs
