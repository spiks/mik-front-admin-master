import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Vaccinations from './Vaccinations'
import VaccinationDetails from './VaccinationDetails'

const VaccinationsRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={`${routes.vaccinationDetails}`} component={VaccinationDetails}/>
            <Route component={Vaccinations}/>
        </Switch>
    )
}

export default VaccinationsRoutes
