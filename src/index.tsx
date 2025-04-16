import {hot} from 'react-hot-loader/root'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Router, Switch, Route} from 'react-router-dom'
import {StylesProvider, ThemeProvider} from '@material-ui/styles'
import {createTheme} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import ruLocale from 'date-fns/locale/ru'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'

import 'bootstrap'
import 'common/styles/base'

import history from 'services/history'
import routes from 'routes'
import MobxProvider from 'stores/MobxProvider'

import Modal from 'common/components/modal/Modal'
import Notifications from 'common/components/notifications/Notifications'
import PrivateRoute from 'common/routes/PrivateRoute'

import Auth from 'app/Auth/Auth'
import SetPassword from 'app/Auth/SetPassword'

const theme = createTheme({
    palette: {
        primary: {
            main: '#23AEA3'
        },
        secondary: {
            main: '#81A0FF'
        }
    }
})

class RootComponent extends React.Component {
    componentDidMount() {
        if (window.location.pathname === routes.main) {
            history.push(routes.stories)
        }
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <MobxProvider>
                            <Router history={history}>
                                <Switch>
                                    <Route path={routes.setPassword} component={SetPassword}/>
                                    <Route path={routes.auth} component={Auth}/>
                                    <PrivateRoute/>
                                </Switch>
                                <Modal/>
                                <Notifications/>
                            </Router>
                        </MobxProvider>
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </StylesProvider>
        )
    }
}

const HotRootComponent = hot(RootComponent)

ReactDOM.render(
    process.env.NODE_ENV === 'development' && <HotRootComponent/> || <RootComponent/>,
    document.getElementById('root')
)
