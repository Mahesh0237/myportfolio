import Footerone from '@/components/footer/Footerone'
import Headwrapper from '@/components/header/Headwrapper'
import Topbarwrapper from '@/components/topbar/Topbarwrapper'
import Profiledetails from '@/components/userprofile/Profiledetails';
import { cookies } from 'next/headers';
import React, { Suspense } from 'react'

async function page({ params }) {
    const { useruid } = params;
    const cookieStore = await cookies();
    const uuid = cookieStore.get('uuid')?.value;
    return (
        <Suspense>
            <Topbarwrapper />
            <Headwrapper
                uuid={uuid}
            />
            <Profiledetails
                useruid={useruid}
            />
            <Footerone />
        </Suspense>
    )
}

export default page