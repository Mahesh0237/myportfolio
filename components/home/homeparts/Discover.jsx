import Image from 'next/image'
import React from 'react'
import discover_unique from '@/public/assets/discover_unique.png'
import dairies_written from '@/public/assets/dairies_written.svg'
import customer_satisfaction from '@/public/assets/customer_satisfaction.svg'
import secure_journals from '@/public/assets/secure_journals.svg'
import serving_countries from '@/public/assets/serving_countries.svg'


function Discover() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#fff] md:space-x-[4vw]">
            <div className='col-span-1 space-y-[3vh]'>
                <p className="text-[20px] text-center md:text-start md:text-[36px] 2xl:text-[40px] 3xl:text-[44px] 4xl:text-[48px] text-[#2B2B2B] font-manrope font-[800] md:w-[60%]  leading-tight">
                    Discover What Makes Us Unique
                </p>
                <p className="text-center md:text-start text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[16px] 2xl:text-[20px] 3xl:text-[22px] 4xl:text-[26px] font-[500]">
                    Unveiling the passion, purpose, and heart behind everything we do.
                </p>
                <div className='grid grid-cols-2 w-full gap-6 items-center'>
                    <div className='col-span-2 md:col-span-1 flex bg-[#F1EBFF] rounded-lg w-full h-fit p-[8%] space-x-[4%]'>
                        <Image
                            src={dairies_written}
                            alt='dairies_written'
                            className='h-fit w-fit' />
                        <div className='space-y-[3%]'>
                            <p className="text-[#2B2B2B] font-manrope text-[16px] md:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[800] ">
                                10000+
                            </p>
                            <p className="text-[#2B2B2B] font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400]">
                                Dairies Written
                            </p>
                        </div>
                    </div>
                    <div className='col-span-2 md:col-span-1 flex bg-[#E7F5E8] rounded-lg w-full h-fit p-[8%] space-x-[4%]'>
                        <Image
                            src={customer_satisfaction}
                            alt='customer_satisfaction'
                            className='h-fit w-fit' />
                        <div className='space-y-[3%]'>
                            <p className="text-[#2B2B2B] font-manrope text-[16px] md:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[800] ">
                                95%
                            </p>
                            <p className="text-[#2B2B2B] font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400]">
                                Customer Satisfaction
                            </p>
                        </div>
                    </div>
                    <div className='col-span-2 md:col-span-1 flex bg-[#FFF9EE] rounded-lg w-full h-fit p-[8%] space-x-[4%]'>
                        <Image
                            src={serving_countries}
                            alt='serving_countries'
                            className='h-fit w-fit' />
                        <div className='space-y-[3%]'>
                            <p className="text-[#2B2B2B] font-manrope text-[16px] md:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[800] ">
                                25+
                            </p>
                            <p className="text-[#2B2B2B] font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400]">
                                Serving Countries
                            </p>
                        </div>
                    </div>
                    <div className='col-span-2 md:col-span-1 flex bg-[#FEEDFA] rounded-lg w-full h-fit p-[8%] space-x-[4%]'>
                        <Image
                            src={secure_journals}
                            alt='secure_journals'
                            className='h-fit w-fit' />
                        <div className='space-y-[3%]'>
                            <p className="text-[#2B2B2B] font-manrope text-[16px] md:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[800] ">
                                100%
                            </p>
                            <p className="text-[#2B2B2B] font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400]">
                                Secure Journals
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-1 mt-[4vh] md:mt-0'>
                <Image
                    src={discover_unique}
                    alt='get_yourstory'
                    className='h-full w-full rounded-md'
                />
            </div>
        </div>
    )
}

export default Discover