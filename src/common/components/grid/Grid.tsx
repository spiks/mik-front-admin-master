import React, {forwardRef, HTMLAttributes} from 'react'

const cx = require('classnames/bind').bind(require('./grid.scss'))

interface Props extends HTMLAttributes<HTMLDivElement> {
    centered?: boolean
    column?: boolean
    inline?: boolean
    justifyContentCenter?: boolean
    justifyContentBetween?: boolean
    justifyContentStart?: boolean
    justifyContentEnd?: boolean
    alignItemsCenter?: boolean
    alignItemsEnd?: boolean
    alignItemsStart?: boolean
    templateColumns?: string
    templateRows?: string
    templateAreas?: string
}

const Grid = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
        centered, justifyContentBetween, justifyContentEnd, alignItemsCenter, alignItemsEnd, inline, justifyContentStart,
        column, justifyContentCenter, className, alignItemsStart, style, templateColumns, templateRows, templateAreas, ...restProps
    } = props

    return (
        <div ref={ref}
             className={cx(
                 'grid',
                 centered && 'justify-content-center align-items-center',
                 {
                     'flex-direction-column': column,
                     'justify-content-center': justifyContentCenter,
                     'justify-content-between': justifyContentBetween,
                     'justify-content-end': justifyContentEnd,
                     'justify-content-start': justifyContentStart,
                     'align-items-center': alignItemsCenter,
                     'align-items-start': alignItemsStart,
                     'align-items-end': alignItemsEnd,
                     'inline': inline
                 }, className)}
             style={{gridTemplateColumns: templateColumns, gridTemplateRows: templateRows, gridTemplateAreas: templateAreas, ...style}}
             {...restProps}>
            {props.children}
        </div>
    )
})

export default Grid
