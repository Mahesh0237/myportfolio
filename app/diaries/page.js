import React from 'react';
import dynamic from 'next/dynamic';


const Headwrapper = dynamic(() => import('@/components/header/Headwrapper'))
const Footerone = dynamic(() => import('@/components/footer/Footerone'))
const Dairieswrapper = dynamic(() => import('@/components/dairies/Dairieswrapper'))
const Topbarwrapper = dynamic(() => import('@/components/topbar/Topbarwrapper'))





function Page() {
    return (
        <>
            <Topbarwrapper />
            <Headwrapper />
            <Dairieswrapper />
            <Footerone />
        </>
    );
}

export default Page;

