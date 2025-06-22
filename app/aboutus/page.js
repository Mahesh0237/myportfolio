import React from 'react';
import dynamic from 'next/dynamic';


const Headwrapper = dynamic(() => import('@/components/header/Headwrapper'))
const Footerone = dynamic(() => import('@/components/footer/Footerone'))
const Aboutuswrapper = dynamic(() => import('@/components/aboutus/Aboutuswrapper'))
const Topbarwrapper = dynamic(() => import('@/components/topbar/Topbarwrapper'))





function Page() {
    return (
        <>
            <Topbarwrapper />
            <Headwrapper />
            <Aboutuswrapper />
            <Footerone />
        </>
    );
}

export default Page;

