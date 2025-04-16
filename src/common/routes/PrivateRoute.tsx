import * as React from 'react'
import {observer} from 'mobx-react'
import {Redirect, RouteProps} from 'react-router'

import routes from 'routes'
import {useStores} from 'stores/MobxProvider'

import Layout from 'app/App/Layout'

const PrivateRoute: React.FC<RouteProps> = () => {
    const {accessToken} = useStores().authStore

    if (!accessToken) {
        return <Redirect to={routes.auth}/>
    }

    return <Layout />
}

export default observer(PrivateRoute)
