import React, {ReactNode} from 'react'

interface Props {
    status: string
    children: ReactNode
}

const ActionLinkWithStatus: React.FC<Props> = ({status, children}) => {
    return <div>
        <div className='mb-8'>{status}</div>
        {children}
    </div>
}

export default ActionLinkWithStatus
