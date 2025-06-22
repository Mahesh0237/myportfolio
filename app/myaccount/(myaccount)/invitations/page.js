import Groupdiaryinvitationswrapper from '@/components/myaccount/invitations/Groupdiaryinvitationswrapper';
import Invitationswrapper from '@/components/myaccount/invitations/Invitationswrapper'
import { cookies } from 'next/headers';
import React from 'react'

async function page() {
  const cookieStore = await cookies();
  const uuid = cookieStore.get('uuid')?.value;
  return (
    <div className='bg-[#fbfbfb] px-4 sm:px-6 md:px-8 lg:px-10 py-3 h-[calc(100vh-130px)] overflow-y-auto'>
      <Invitationswrapper
        user_uid={uuid}
      />
      <Groupdiaryinvitationswrapper
        user_uid={uuid}
      />
    </div>
  )
}

export default page