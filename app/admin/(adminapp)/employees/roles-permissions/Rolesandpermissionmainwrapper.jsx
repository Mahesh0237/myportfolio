'use client'
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import Rolesandpermissionwrapper from '@/components/adminapp/roles-permissions/Rolesandpermissionwrapper';

function Rolesandpermissionmainwrapper() {
  const userInfo = useUserDetails(state => state.userInfo);
  let role_name = userInfo?.role_name;
  const router = useRouter();

  // useEffect(() => {
  //   if (role_name !== 'Super Admin') {
  //     router.push('/dashboard');
  //   }
  // }, [role_name, router])


  return (
    <Rolesandpermissionwrapper />
  )
}

export default Rolesandpermissionmainwrapper
