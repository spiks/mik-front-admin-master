import * as React from 'react'

import Column, {ColumnProps, InjectedProps} from 'common/components/table/Column'
import Flex from 'common/components/flex/Flex'
import Loader from 'common/components/loader/Loader'
import Pagination from 'common/components/pagination/Pagination'
import {TextH2} from 'common/components/text/Text'

import {Sort, SortDirection} from './interfaces/sort'

const cx = require('classnames/bind').bind(require('./styles/table.scss'))

interface Props extends Partial<Sort> {
    source: object[]
    height?: string
    maxHeight?: string
    bodyCellMinHeight?: string
    bodyCellMaxHeight?: string
    isLoading?: boolean
    activeRowClassName?: string
    cellClassName?: string
    bodyBottomThreshold?: number
    placeholder?: React.ReactNode
    onChangeSort?: (column: string, direction: SortDirection) => void
    onClickRow?: (item: object) => void
    activeRow?: (item: object) => boolean
    rowClassName?: (item: object) => string
    loadMore?: () => Promise<number>
    className?: string
}

const defaultProps: Partial<Props> = {
    bodyCellMinHeight: '88px',
    activeRowClassName: '',
    bodyBottomThreshold: 48,
    placeholder: <TextH2 className='text-shade-30'>Список пуст</TextH2>
}

const Table: React.FC<Props> = props => {
    const {
        children, onChangeSort, onClickRow, source, column, direction, activeRow, bodyCellMinHeight, cellClassName, rowClassName, activeRowClassName,
        bodyBottomThreshold, isLoading, loadMore, bodyCellMaxHeight, placeholder, maxHeight, height, className
    } = props

    const [columns, setColumns] = React.useState<ColumnProps[]>([])

    const tableBody = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        let effectColumns: ColumnProps[] = []

        React.Children.forEach(children, (child: React.ReactElement) => {
            if (child && child.type === Column) {
                effectColumns.push({
                    data: child.props.data,
                    className: child.props.className,
                    width: child.props.width,
                    disableRowClick: child.props.disableRowClick,
                    cellClassName: child.props.cellClassName
                })

                setColumns(effectColumns)
            }
        })
    }, [children])

    const handleSortableClick = (name: string): void => {
        if (!!onChangeSort) {
            const sortDirection = column === name
                ? (direction === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC)
                : props.direction

            if (sortDirection) {
                onChangeSort(name, sortDirection)
            }
        }
    }

    const header = (): JSX.Element =>
        <Flex className={cx('header-row')}>
            {React.Children.map(children, (child: React.ReactElement<any>): React.ReactElement<any> =>
                child && React.cloneElement(child, {
                    onSortableClick: handleSortableClick,
                    column,
                    direction
                } as InjectedProps))}
        </Flex>

    const renderRow = (row: object, index: number): JSX.Element => row &&
        <Flex key={index} onClick={() => onClickRow ? onClickRow(row) : false}
              className={cx(
                  {pointer: !!onClickRow, active: activeRow && activeRow(row), [activeRowClassName as string]: activeRow && activeRow(row)},
                  rowClassName && rowClassName(row),
                  'body-row')}>
            {columns.map((column, columnIndex) => (
                <Flex key={`${index}-${columnIndex}`}
                      alignItemsCenter
                      style={{
                          flex: column.width ? column.width : 1,
                          maxWidth: column.width ? column.width : '100%',
                          minHeight: bodyCellMinHeight,
                          maxHeight: bodyCellMaxHeight
                      }}
                      className={cx('table-cell', cellClassName, column.cellClassName)}>
                    {typeof column.data === 'string' ? <div>{(row as any)[column.data as string]}</div> : column.data(row, index)}
                </Flex>
            ))}
        </Flex>

    const renderRows = (rows: object[]): JSX.Element[] | null =>
        rows.length !== 0 ? rows.map(renderRow) : null

    const getScrollArea = (): string | undefined => {
        if (tableBody.current) {
            return `calc(100vh - ${tableBody.current.offsetTop + bodyBottomThreshold!}px)`
        }

        return undefined
    }

    return <Flex column className={cx('table', className)}>
        {header()}

        <div id='table-body' style={{height: height || getScrollArea(), maxHeight}} ref={tableBody}
             className={cx('table-body')}>
            {tableBody.current && !isLoading
                ? source.length !== 0 ? loadMore
                    ? <Pagination scrollable={() => document.querySelector('#table-body')!} loadMore={loadMore}>{renderRows(source)}</Pagination>
                    : renderRows(source) : <Flex justifyContentCenter alignItemsCenter className={cx('placeholder')}>{placeholder}</Flex>
                : <Loader absolute/>}
        </div>
    </Flex>
}

Table.defaultProps = defaultProps

export default Table
