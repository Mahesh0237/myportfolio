import Image from 'next/image'
import React from 'react'
import our_story from '@/public/assets/our_story.png'

function Ourstory() {
    return (
        <div className="flex flex-col md:flex-row md:gap-3 gap-6 px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FFF] space-x-[4vw]">
            <div className='w-full md:basis-[45%] space-y-[1.8vh] my-auto'>
                <p className="text-[#044093] text-[14px] md:text-[16px] font-[600] w-[90%] 2xl:text-[26px]">
                    Our Story
                </p>
                <p className=" capitalize text-[20px] md:text-[40px] text-[#141414] font-manrope md:font-[800] font-[600] leading-tight 2xl:text-[38px]">
                    A warm, engaging story about how Dairy Souls was founded.
                </p>
                <p className="text-[#2B2B2B99] font-manrope text-[14.5px] md:text-[15px] font-[500] leading-5 2xl:text-[28px] 2xl:leading-10">
                    To create a safe, creative space for people to express their thoughts, share their emotions,
                    and document their journeys. Our mission is to empower individuals to reflect, grow, and
                    connect with themselves through the art of writing, while ensuring their privacy and providing
                    tools that inspire creativity.
                </p>
            </div>
            <div className='w-full md:basis-[55%]'>
                <Image
                    src={our_story}
                    alt='our_story'
                    className='h-full w-full rounded-[10px] rounded-tl-[102px]'
                />
            </div>
        </div>
    )
}

export default Ourstory