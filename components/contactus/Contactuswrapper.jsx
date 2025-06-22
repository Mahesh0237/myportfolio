import React from 'react'
import dynamic from 'next/dynamic'
import Getintouch from './Getintouch'
import Contactinformation from './Contactinformation'
const Contactusbanner = dynamic(() => import('./Contactusbanner'))

function Contactuswrapper() {
    return (
        <>
            <Contactusbanner />
            <Getintouch />
            <Contactinformation />
        </>
    )
}

export default Contactuswrapper