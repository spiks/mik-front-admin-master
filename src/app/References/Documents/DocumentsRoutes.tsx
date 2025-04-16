import React from 'react'
import {Route, Switch} from 'react-router'

import routes from 'routes'

import Documents from './Documents'
import DocumentDetails from './DocumentDetails'

const DocumentsRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path={routes.referencesDocumentDetails} component={DocumentDetails} />
            <Route component={Documents}/>
        </Switch>
    )
}

export default DocumentsRoutes
