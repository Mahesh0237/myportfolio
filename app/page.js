import React from 'react'
import { cookies } from 'next/headers'
import Topbarwrapper from '@/components/topbar/Topbarwrapper';
import Headwrapper from '@/components/header/Headwrapper';
import Homewrapper from '@/components/home/Homewrapper';
import Footerone from '@/components/footer/Footerone';

async function page() {
  const cookieStore = await cookies();
  const isLoggedCookie = cookieStore.get('is_logged')?.value;
  const uuid = cookieStore.get('uuid')?.value;
  console.log('uuid', uuid)

  return (
    <>
      <Topbarwrapper />
      <Headwrapper isLoggedCookie={isLoggedCookie} uuid={uuid} />
      <Homewrapper isLoggedCookie={isLoggedCookie} />
      <Footerone />
    </>
  )
}

export default page