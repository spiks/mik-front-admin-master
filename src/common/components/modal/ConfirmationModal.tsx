import React, {useState} from 'react'

import Button from '../button/Button'
import modalStore from './ModalStore'
import Flex from '../flex/Flex'
import {TextBody, TextH2} from '../text/Text'

interface Props {
    title: string
    acceptButtonText: string
    cancelButtonText: string
    onAccept: () => Promise<void>
    redButtons?: boolean
    content?: string
}

const ConfirmationModal: React.FC<Props> = ({title, content, onAccept, acceptButtonText, cancelButtonText, redButtons}) => {
    const [submitting, setSubmitting] = useState(false)

    const onAcceptClick = async () => {
        setSubmitting(true)

        try {
            await onAccept()
            setSubmitting(false)
            modalStore.closeModal()
        } catch {
            setSubmitting(false)
        }
    }

    return <>
        <TextH2>{title}</TextH2>

        {!!content && <TextBody className='mt-32'>{content}</TextBody>}

        <Flex className='mt-24'>
            <Button onClick={onAcceptClick} red={redButtons} loading={submitting}>{acceptButtonText}</Button>
            <Button className='ml-8' text red={redButtons} disabled={submitting} onClick={modalStore.closeModal}>{cancelButtonText}</Button>
        </Flex>
    </>
}

export default ConfirmationModal
