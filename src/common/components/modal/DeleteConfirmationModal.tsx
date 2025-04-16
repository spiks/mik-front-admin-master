import * as React from 'react'

import ConfirmationModal from './ConfirmationModal'

interface Props {
    title: string
    onAccept: () => Promise<void>
    content?: string
}

const DeleteConfirmationModal: React.FC<Props> = ({title, content, onAccept}) =>
    <ConfirmationModal title={title} content={content} acceptButtonText='Удалить' cancelButtonText='Отмена' onAccept={onAccept} redButtons/>

export default DeleteConfirmationModal
