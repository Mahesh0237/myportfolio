import React from 'react'
import dynamic from 'next/dynamic'
import Customerreview from './Customerreview'
import Letsstartwriting from './Letsstartwriting'
const Aboutusbanner = dynamic(() => import('./Aboutusbanner'))
const Ourstory = dynamic(() => import('./Ourstory'))
const Featurehighlights = dynamic(() => import('./Featurehighlights'))
const Advantages = dynamic(() => import('./Advantages'))




function Aboutuswrapper() {
    return (
        <>
            <Aboutusbanner />
            <Ourstory />
            <Featurehighlights />
            <Advantages />
            <Customerreview />
            <Letsstartwriting />


        </>
    )
}

export default Aboutuswrapper