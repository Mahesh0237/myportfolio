import Contributionwrapper from '@/components/myaccount/contributionrequests/Contributionwrapper';
import { cookies } from 'next/headers';
import React from 'react';

async function page() {
  const cookieStore = await cookies();
  const uuid = cookieStore.get('uuid')?.value;
  return (
    <Contributionwrapper user_uid={uuid}/>
  )
}

export default page