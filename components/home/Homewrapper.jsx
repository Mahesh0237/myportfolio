import dynamic from 'next/dynamic';
import React from 'react'
const Homebanner = dynamic(() => import('./homeparts/Homebanner'));
const Whychooseus = dynamic(() => import('./homeparts/Whychooseus'));
const Getyourstory = dynamic(() => import('./homeparts/Getyourstory'))
const Latestpostsdairies = dynamic(() => import('./homeparts/Latestpostsdairies'))
const Discover = dynamic(() => import('./homeparts/Discover'))
const Contact = dynamic(() => import('./homeparts/Contact'))

function Homewrapper({isLoggedCookie}) {
  return (
    <>
      <Homebanner isLoggedCookie={isLoggedCookie}/>
      <Whychooseus />
      <Getyourstory />
      <Latestpostsdairies />
      <Discover />
      <Contact />
    </>
  )
}

export default Homewrapper