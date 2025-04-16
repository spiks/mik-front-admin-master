import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Support from './Support'
import SupportMessages from './SupportMessages'

const SupportRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={`${routes.supportMessages}`} component={SupportMessages}/>
            <Route component={Support}/>
        </Switch>
    )
}

export default SupportRoutes
