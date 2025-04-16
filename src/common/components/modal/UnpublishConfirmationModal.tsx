import * as React from 'react'

import ConfirmationModal from './ConfirmationModal'

interface Props {
    title: string
    onAccept: () => Promise<void>
    content?: string
}

const UnpublishConfirmationModal: React.FC<Props> = ({title, content, onAccept}) =>
    <ConfirmationModal title={title}
                       content={content}
                       acceptButtonText='Снять с публикации'
                       cancelButtonText='Отмена'
                       onAccept={onAccept}
                       redButtons/>

export default UnpublishConfirmationModal
