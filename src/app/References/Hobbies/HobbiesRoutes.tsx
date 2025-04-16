import React from 'react'
import {Route, Switch} from 'react-router'

import Hobbies from './Hobbies'

const HobbiesRoutes: React.FC = () => {
    return (
        <Switch>
            <Route component={Hobbies}/>
        </Switch>
    )
}

export default HobbiesRoutes
