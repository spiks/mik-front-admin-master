import * as React from 'react'

import Flex from 'common/components/flex/Flex'
import Icon from 'common/components/icon/Icon'
import {TextBody} from 'common/components/text/Text'

import {Sort, SortDirection} from './interfaces/sort'
import {DataFunctionType} from './interfaces/dataFunction'

const cx = require('classnames/bind').bind(require('./styles/table.scss'))

export interface InjectedProps extends Sort {
    onSortableClick: (name: string) => void
}

export interface ColumnProps {
    data: string | DataFunctionType
    width?: string
    className?: string
    cellClassName?: string
    disableRowClick?: boolean
    sortable?: string
}

const Column: React.FC<ColumnProps> = props => {
    const {children, width, sortable, className, data, cellClassName, ...rest} = props

    const injectedProps: InjectedProps = rest as InjectedProps

    const onClick = (): void => {
        if (sortable) {
            injectedProps.onSortableClick(sortable)
        }
    }

    const sortIconName = (isActiveSort: boolean): string => {
        if (isActiveSort && injectedProps.direction === SortDirection.ASC) {
            return 'chevron-up'
        }

        return 'chevron-down'
    }

    return <Flex onClick={onClick} style={{flex: 1, maxWidth: width ? width : 'auto'}}
                 className={cx(className, {sortable, 'sortable-active': sortable && injectedProps.column === sortable}, 'table-cell')}>
        <Flex alignItemsCenter className={cx('sort-container', 'relative')}>
            {typeof children === 'string' ? <TextBody className='text-shade-60'>{children}</TextBody> : children}
            {sortable && <Icon className={cx('sort-icon')} name={sortIconName(injectedProps.column === sortable)}/>}
        </Flex>
    </Flex>
}

export default Column
