import React from 'react'

import {VaccinationGroup} from '../interfaces/models'
import EpidemicFields from './EpidemicFields'
import TouristicFields from './TouristicFields'
import DatePeriodFields from './pickers/DatePeriodFields'

interface Props {
    currentGroup: VaccinationGroup
}

const FieldsByGroup: React.FC<Props> = ({currentGroup}) => {
    switch (currentGroup) {
        case VaccinationGroup.KEP:
            return <>
                <EpidemicFields withTitle withRegions/>
                <DatePeriodFields/>
            </>
        case VaccinationGroup.TS:
            return <TouristicFields withTitle className='mt-64'/>
        case VaccinationGroup.OTHER:
            return <>
                <EpidemicFields withTitle={false} withRegions={false}/>
                <TouristicFields withTitle={false} className='mt-24'/>
                <DatePeriodFields/>
            </>
        default:
            return null
    }
}

export default FieldsByGroup
