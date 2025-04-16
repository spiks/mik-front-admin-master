import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import FaqList from './FaqList'
import FaqDetails from './FaqDetails'

interface Props {

}

const FaqRoutes: React.FC<Props> = props => {
    return (
        <Switch>
            <Route path={`${routes.faqDetails}`} component={FaqDetails}/>
            <Route component={FaqList}/>
        </Switch>
    )
}

export default FaqRoutes
