import Admindiarydetailswrapper from '@/components/adminapp/diarydetails/Admindiarydetailswrapper';
import { cookies } from 'next/headers';
import React from 'react'

async function page({ params }) {
    const { diaryuid } = params;
    const cookieStore = await cookies();
    const uuid = cookieStore.get('adminuuid')?.value;
    return (
        <div className='bg-[#f4f4f4] px-4 py-4'>
            <Admindiarydetailswrapper
                admin_uid={uuid}
                diaryuid={diaryuid}
            />
        </div>
    )
}

export default page