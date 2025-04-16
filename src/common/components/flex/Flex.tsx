import React, {forwardRef} from 'react'
import {HTMLAttributes, CSSProperties} from 'react'
import cx from 'classnames'

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
    wrap?: boolean
    style?: CSSProperties
}

const Flex = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
        centered, justifyContentBetween, justifyContentEnd, alignItemsCenter, alignItemsEnd, inline, justifyContentStart,
        column, justifyContentCenter, className, wrap, alignItemsStart, style, ...restProps
    } = props

    return (
        <div ref={ref} className={cx(
            inline && 'inline-flex' || 'flex',
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
                'inline': inline,
                'flex-wrap': wrap
            }, className)}
            style={style}
             {...restProps}>
            {props.children}
        </div>
    )
})

export default Flex
