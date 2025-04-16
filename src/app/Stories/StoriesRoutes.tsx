import React from 'react'
import {Route, Switch} from 'react-router'

import Stories from './Stories'
import StoryDetails from './StoryDetails'
import routes from '../../routes'

interface Props {

}

const StoriesRoutes: React.FC<Props> = props => {
    return (
        <Switch>
            <Route path={routes.storyDetails} component={StoryDetails}/>
            <Route component={Stories}/>
        </Switch>
    )
}

export default StoriesRoutes
