import dynamic from 'next/dynamic'
import React from 'react'
import Professionalteam from './Professionalteam'

const Teamsbanner = dynamic(() => import('./Teamsbanner'))



function Teamswrapper() {
    return (
        <>
            <Teamsbanner />
            <Professionalteam />

        </>
    )
}

export default Teamswrapper