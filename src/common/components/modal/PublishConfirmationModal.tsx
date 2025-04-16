import * as React from 'react'

import ConfirmationModal from './ConfirmationModal'

interface Props {
    title: string
    onAccept: () => Promise<void>
    content?: string
}

const PublishConfirmationModal: React.FC<Props> = ({title, content, onAccept}) =>
    <ConfirmationModal title={title} content={content} acceptButtonText='Опубликовать' cancelButtonText='Отмена' onAccept={onAccept}/>

export default PublishConfirmationModal
