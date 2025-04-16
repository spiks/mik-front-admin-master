import React from 'react'
import {Route, Switch} from 'react-router'

import SupportTopics from './SupportTopics'

const SupportTopicsRoutes: React.FC = () => {
    return (
        <Switch>
            <Route component={SupportTopics}/>
        </Switch>
    )
}

export default SupportTopicsRoutes
