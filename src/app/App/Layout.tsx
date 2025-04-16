import React from 'react'
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from 'react-router'

import routes from 'routes'
import {useStores} from 'stores/MobxProvider'

import SideBar from './Sidebar'
import NoMatch from '../Errors/NoMatch'
import UsersRoutes from '../Users/UsersRoutes'
import {UserRole} from '../Users/interfaces/models'
import StoriesRoutes from '../Stories/StoriesRoutes'
import AdvicesRoutes from '../Advices/AdvicesRoutes'
import FaqRoutes from '../Faq/FaqRoutes'
import References from '../References/References'
import ResetPassword from '../Profile/ResetPassword'
import PostsRoutes from '../Posts/PostsRoutes'
import VaccinationsRoutes from '../Vaccinations/VaccinationsRoutes'
import SupportRoutes from '../Support/SupportRoutes'
import About from '../About/About'

const cx = require('classnames/bind').bind(require('./styles/layout.scss'))

const Layout: React.FC<RouteComponentProps> = props => {
    const {profile} = useStores().authStore

    const adminsRoutes = [
        <Route key={routes.stories} path={routes.stories} component={StoriesRoutes}/>,
        <Route key={routes.vaccinations} path={routes.vaccinations} component={VaccinationsRoutes}/>,
        <Route key={routes.users} path={routes.users} component={UsersRoutes}/>,
        <Route key={routes.advices} path={routes.advices} component={AdvicesRoutes}/>,
        <Route key={routes.references} path={routes.references} component={References}/>,
        <Route key={routes.faq} path={routes.faq} component={FaqRoutes}/>,
        <Route key={routes.posts} path={routes.posts} component={PostsRoutes}/>,
        <Route key={routes.about} path={routes.about} component={About}/>
    ]

    return (
        <div className={cx('wrapper')}>
            <SideBar/>
            <main className={cx('content-wrapper')}>
                <Switch>
                    <Route exact path={routes.main}>
                        {profile?.role !== UserRole.SUPPORT && <Redirect to={routes.stories}/> || <Redirect to={routes.support}/>}
                    </Route>
                    {profile?.role !== UserRole.SUPPORT && adminsRoutes}
                    <Route path={routes.resetPassword} component={ResetPassword}/>
                    <Route path={routes.support} component={SupportRoutes}/>

                    <Route component={NoMatch}/>
                </Switch>
            </main>
        </div>
    )
}

export default withRouter(Layout)
