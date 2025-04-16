import React from 'react'

import Flex from '../../flex/Flex'
import {Tooltip} from '../../tooltip/Tooltip'
import {IconClose, IconCopy, IconEdit} from '../../icon/Icons'

interface Props {
    onCopyClick?: () => void
    onEditClick?: () => void
    onCloseClick?: () => void
    copyTooltipText?: string
}

const ActionColumn: React.FC<Props> = ({onCopyClick, onEditClick, onCloseClick, copyTooltipText = 'Скопировать'}) => {
    return (
        <Flex justifyContentEnd>
            {onCopyClick && <Tooltip text={copyTooltipText}>
                <div><IconCopy onClick={onCopyClick}/></div>
            </Tooltip>}
            {onEditClick && <Tooltip text='Редактировать'>
                <div><IconEdit onClick={onEditClick}/></div>
            </Tooltip>}
            {onCloseClick && <Tooltip text='Удалить'>
                <div><IconClose onClick={onCloseClick}/></div>
            </Tooltip>}
        </Flex>
    )
}

export default ActionColumn
