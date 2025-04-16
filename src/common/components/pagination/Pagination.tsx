import * as React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'

import Loader from 'common/components/loader/Loader'

interface Props {
    loadMore: () => Promise<number>
    scrollable: () => Element | HTMLElement
    threshold?: number
    reverse?: boolean
}

@observer
class Pagination extends React.Component<Props> {
    static defaultProps: Partial<Props> = {
        threshold: 400,
        reverse: false
    }

    @observable fullyLoaded: boolean
    @observable fetching: boolean

    componentDidMount() {
        this.handleScroll()
        this.props.scrollable().addEventListener('scroll', this.handleScroll, false)
    }

    componentWillUnmount() {
        this.fullyLoaded = false
        this.fetching = false

        this.props.scrollable().removeEventListener('scroll', this.handleScroll)
    }

    render() {
        const {children} = this.props

        return <React.Fragment>
            {children}

            {this.fetching && <Loader/>}
        </React.Fragment>
    }

    private handleScroll = (): void => {
        if (this.fetching || this.fullyLoaded) {
            return
        }

        const scrollable = this.props.scrollable()
        const height = scrollable.getBoundingClientRect().height
        const scrollCondition = this.props.reverse
            ? scrollable.scrollTop < this.props.threshold!
            : scrollable.scrollTop + height > scrollable.scrollHeight - this.props.threshold!

        if (scrollCondition) {
            this.fetching = true

            this.props.loadMore()
                .then(count => {
                    this.fetching = false

                    if (count === 0) {
                        this.fullyLoaded = true
                    }
                })
                .catch(() => this.fetching = false)
        }
    }
}

export default Pagination
