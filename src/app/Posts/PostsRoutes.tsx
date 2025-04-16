import React from 'react'
import {Route, Switch} from 'react-router'

import Posts from './Posts'
import routes from '../../routes'
import PostDetails from './PostDetails'

const PostsRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={`${routes.postDetails}`} component={PostDetails}/>
            <Route component={Posts}/>
        </Switch>
    )
}

export default PostsRoutes
