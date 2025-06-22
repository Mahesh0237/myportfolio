import dynamic from 'next/dynamic'
import React from 'react'
const Dairiesbanner = dynamic(() => import('./Dairiesbanner'))
const Latestdiaries = dynamic(() => import('./Latestdiaries'))
const Startnewchapter = dynamic(() => import('./Startnewchapter'))
const Featureditems = dynamic(() => import('./Featureditems'))

function Dairieswrapper() {
    return (
        <>
            <Dairiesbanner />
            <Latestdiaries />
            <Featureditems />
            <Startnewchapter />
        </>
    )
}

export default Dairieswrapper