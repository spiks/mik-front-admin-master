import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Countries from './Countries'
import CountryDetails from './CountryDetails'

const CountriesRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={routes.referencesCountryDetails} component={CountryDetails} />
            <Route component={Countries}/>
        </Switch>
    )
}

export default CountriesRoutes
