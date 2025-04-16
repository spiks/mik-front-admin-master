import {ReactNode} from 'react'
import {observable, action} from 'mobx'

export interface ModalData {
    content: ReactNode
    className?: string
    withCross?: boolean
    small?: boolean
}

export class ModalStore {
    @observable openedModals: ModalData[] = []

    @action openModal = (modalData: ModalData) => {
        this.openedModals.push(modalData)
    }

    @action closeModal = () => this.openedModals.pop()

    @action closeAllModals = () => this.openedModals = []
}

const modalStore = new ModalStore()

export default modalStore
