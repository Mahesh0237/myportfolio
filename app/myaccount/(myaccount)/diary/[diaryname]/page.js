import Diarydetailswrapper from '@/components/myaccount/diary/viewdiary/Diarydetailswrapper';
import { cookies } from 'next/headers';
import React from 'react';

async function page({ params }) {
  const { diaryname } = params;
  const cookieStore = await cookies();
  const uuid = cookieStore.get('uuid')?.value;
  const is_logged = cookieStore.get('is_logged')?.value;
  return (
    <Diarydetailswrapper
      user_uid={uuid}
      is_logged={is_logged}
      diaryname={diaryname}
    />
  )
}

export default page