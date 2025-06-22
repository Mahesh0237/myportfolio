'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const Rolesandpermissionmainwrapper = dynamic(() => import('./Rolesandpermissionmainwrapper'), {
    ssr: false
})

function page() {
  return (
    <div className='px-4 py-4'>
      <Rolesandpermissionmainwrapper />
    </div>
  )
}

export default page
