import * as React from 'react'

import Flex from 'common/components/flex/Flex'
import Icon from 'common/components/icon/Icon'
import {TextH1, TextH2} from 'common/components/text/Text'

import ErrorLayout from './ErrorLayout'

const cx = require('classnames/bind').bind(require('./styles/errors.scss'))

const NoMatch: React.FC = () => {
    return (
        <ErrorLayout
            title={<Flex className={cx('title-section')}>
                <TextH1 className={cx('title')}>404</TextH1>
                <Icon className={cx('plague-image')} name='404-plague'/>
            </Flex>}
            subtitle={<Flex column alignItemsCenter>
                <div className={cx('title-404')}>Страница не найдена</div>
                <div className='text-shade-60'>Возможно, неверная ссылка или опечатка в адресе.</div>
            </Flex>}/>
    )
}

export default NoMatch
