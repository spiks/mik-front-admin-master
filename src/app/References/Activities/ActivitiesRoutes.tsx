import React from 'react'
import {Route, Switch} from 'react-router'

import Activities from './Activities'

const ActivitiesRoutes: React.FC = () => {
    return (
        <Switch>
            <Route component={Activities}/>
        </Switch>
    )
}

export default ActivitiesRoutes
