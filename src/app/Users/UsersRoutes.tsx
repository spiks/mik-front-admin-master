import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Users from './Users'
import UserDetails from './UserDetails'

interface Props {

}

const UsersRoutes: React.FC<Props> = props => {
    return (
        <Switch>
            <Route path={`${routes.userDetails}`} component={UserDetails}/>
            <Route component={Users}/>
        </Switch>
    )
}

export default UsersRoutes
