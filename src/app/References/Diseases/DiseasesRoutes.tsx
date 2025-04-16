import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Diseases from './Diseases'
import DiseaseDetails from './DiseaseDetails'

const DiseasesRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={routes.referencesDiseaseDetails} component={DiseaseDetails} />
            <Route component={Diseases}/>
        </Switch>
    )
}

export default DiseasesRoutes
