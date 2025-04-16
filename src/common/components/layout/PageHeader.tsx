import React from 'react'

import Grid from '../grid/Grid'

const PageHeader: React.FC = props => {
    return (
        <Grid centered templateColumns='1fr 1fr' className='mb-32'>
            {props.children}
        </Grid>
    )
}

export default PageHeader
