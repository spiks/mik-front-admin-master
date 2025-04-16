import React from 'react'

import {TextH2} from 'common/components/text/Text'

import FormActivities from './pickers/FormActivities'
import FormHobbies from './pickers/FormHobbies'
import FormRegions from './pickers/FormRegions'

interface Props {
    withTitle: boolean
    withRegions: boolean
}

const EpidemicFields: React.FC<Props> = ({withTitle, withRegions}) => {
    return (
        <div className='mt-64'>
            {withTitle && <TextH2 className='mb-8'>Для рекомендаций по календарю эпидемических показаний</TextH2>}
            <FormActivities/>
            <FormHobbies/>
            {withRegions && <FormRegions label='Регион проживания'/>}
        </div>
    )
}

export default EpidemicFields
