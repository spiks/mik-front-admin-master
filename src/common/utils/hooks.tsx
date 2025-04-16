import {useLocation} from 'react-router'
import {useEffect, useRef} from 'react'

export const useQuery = () => new URLSearchParams(useLocation().search)

export const usePrevious = (value: any) => {
    const ref = useRef()

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}
