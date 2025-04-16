import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Regions from './Regions'
import RegionDetails from './RegionDetails'

const RegionsRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={routes.referencesRegionDetails} component={RegionDetails} />
            <Route component={Regions}/>
        </Switch>
    )
}

export default RegionsRoutes
