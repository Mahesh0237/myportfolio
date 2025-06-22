import React from 'react';
import dynamic from 'next/dynamic';


const Headwrapper = dynamic(() => import('@/components/header/Headwrapper'))
const Footerone = dynamic(() => import('@/components/footer/Footerone'))
const Contactuswrapper = dynamic(() => import('@/components/contactus/Contactuswrapper'))
const Topbarwrapper = dynamic(() => import('@/components/topbar/Topbarwrapper'))





function Page() {
    return (
        <>
            <Topbarwrapper />
            <Headwrapper />
            <Contactuswrapper />
            <Footerone />
        </>
    );
}

export default Page;

