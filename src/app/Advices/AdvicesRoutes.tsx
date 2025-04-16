import React from 'react'
import {Route, Switch} from 'react-router'

import Advices from './Advices'

interface Props {

}

const AdvicesRoutes: React.FC<Props> = props => {
    return (
        <Switch>
            <Route component={Advices}/>
        </Switch>
    )
}

export default AdvicesRoutes
