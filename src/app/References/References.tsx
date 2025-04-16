import React, {useEffect, useState} from 'react'

import routes from 'routes'
import history from 'services/history'
import Tabs from 'common/components/tabs/Tabs'
import Tab from 'common/components/tabs/Tab'
import Flex from 'common/components/flex/Flex'
import PageTitle from 'common/components/layout/PageTitle'
import PageHeader from 'common/components/layout/PageHeader'

import DiseasesRoutes from './Diseases/DiseasesRoutes'
import ActivitiesRoutes from './Activities/ActivitiesRoutes'
import HobbiesRoutes from './Hobbies/HobbiesRoutes'
import RegionsRoutes from './Regions/RegionsRoutes'
import CountriesRoutes from './Countries/CountriesRoutes'
import SupportTopicsRoutes from './SupportTopics/SupportTopicsRoutes'
import DocumentsRoutes from './Documents/DocumentsRoutes'

const tabs = {
    [routes.referencesDiseases]: ['Заболевания', DiseasesRoutes],
    [routes.referencesActivities]: ['Сферы работы', ActivitiesRoutes],
    [routes.referencesHobbies]: ['Хобби', HobbiesRoutes],
    [routes.referencesRegions]: ['Регионы проживания', RegionsRoutes],
    [routes.referencesCountries]: ['Страны', CountriesRoutes],
    [routes.referencesSupportTopics]: ['Темы обращений пользователей', SupportTopicsRoutes],
    [routes.referencesDocuments]: ['Документы', DocumentsRoutes]
}

const getActiveTab = (): [number, boolean] => {
    let [tabIndex, exactMatch] = [-1, true]

    Object.keys(tabs).some((route: string, index: number) => {
        if (history.location.pathname.startsWith(route)) {
            tabIndex = index
            exactMatch = route === history.location.pathname
            return true
        }
    })

    if (tabIndex === -1) {
        history.replace(routes.referencesDiseases)
        return [0, true]
    }

    return [tabIndex, exactMatch]
}

const References: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(getActiveTab()[0])
    const [headerEnabled, setHeaderEnabled] = useState<boolean>(true)

    useEffect(() => {
        const [tabIndex, exactMatch] = getActiveTab()

        setHeaderEnabled(exactMatch)
        setActiveTab(tabIndex)
    }, [history.location.pathname])

    const renderTabs = (): JSX.Element => {
        const result = []

        for (const [route, definition] of Object.entries(tabs)) {
            result.push(<Tab label={definition[0]} href={route} key={route}/>)
        }

        return <Tabs value={activeTab} className='mb-30'>{result}</Tabs>
    }

    const renderActiveTab = () => {
        const route = Object.keys(tabs)[activeTab]
        const definition = tabs[route]

        return React.createElement(definition[1], {})
    }

    return <>
        {headerEnabled && <PageHeader>
            <Flex alignItemsCenter>
                <PageTitle title='Справочники' subtitle={''}/>
            </Flex>
        </PageHeader>}

        {location.pathname.split('/').pop() !== 'details' && headerEnabled && renderTabs()}

        {renderActiveTab()}
    </>
}

export default References
