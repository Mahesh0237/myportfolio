import React from 'react';
import dynamic from 'next/dynamic';


const Headwrapper = dynamic(() => import('@/components/header/Headwrapper'))
const Footerone = dynamic(() => import('@/components/footer/Footerone'))
const Teamswrapper = dynamic(() => import('@/components/team/Teamswrapper'))
const Topbarwrapper = dynamic(() => import('@/components/topbar/Topbarwrapper'))





function Page() {
    return (
        <>
            <Topbarwrapper />
            <Headwrapper />
            <Teamswrapper />
            <Footerone />
        </>
    );
}

export default Page;