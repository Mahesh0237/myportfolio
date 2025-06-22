import Adddiary from '@/components/myaccount/diary/Adddiary'
import { cookies } from 'next/headers';
import React from 'react'

async function page() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('uuid')?.value;
    return (
        <Adddiary
            user_uid={uuid}
        />
    )
}

export default page