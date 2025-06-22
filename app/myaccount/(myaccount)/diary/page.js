import Diarywrapper from '@/components/myaccount/diary/Diarywrapper'
import { cookies } from 'next/headers';
import React from 'react'

async function page() {
  const cookieStore = await cookies();
  const uuid = cookieStore.get('uuid')?.value;
  const is_logged = cookieStore.get('is_logged')?.value;
  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-10 py-6 h-[calc(100vh-130px)] overflow-y-auto'>
      <Diarywrapper
        user_uid={uuid}
      />
    </div>
  )
}

export default page