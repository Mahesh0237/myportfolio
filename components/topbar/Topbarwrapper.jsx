'use client'
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandLinkedinFilled, IconBrandTwitterFilled, IconBrandYoutubeFilled, IconHeadphones, IconMail } from '@tabler/icons-react'
import React from 'react'
import { useCompanyinfo } from '../zustand/useCompanyinfo';
import Link from 'next/link';

function Topbarwrapper() {
    const company_info = useCompanyinfo((state) => state.company_info);
    return (
        <div className='bg-[#044093] h-fit gap-1 md:gap-4 md:h-7 py-2 md:py-0 flex flex-col md:flex-row items-center justify-between px-[3.5vw]'>
            <div className='flex flex-row items-center justify-center gap-[10px]'>
                <p className="flex items-center justify-center text-[12px] text-[#fff] font-[400]">
                    <IconHeadphones size={18} stroke={1.5} className="mr-2" /> {company_info?.phone_code} {company_info?.phone || 'Not Available'}
                </p>
                <p className="flex items-center justify-center text-[12px] text-[#fff] font-[400]">
                    <IconMail size={18} stroke={1.5} className="mr-2" /> {company_info?.email || 'Not Available'}
                </p>
            </div>
            <div className='flex items-center justify-center gap-[10px]'>
                {
                    company_info?.youtube &&
                    <Link href={company_info?.youtube || "#"} target="_blank">
                        <IconBrandYoutubeFilled color="#fff" size={18} />
                    </Link>
                }
                {
                    company_info?.facebook &&
                    <Link href={company_info?.facebook || "#"} target="_blank">
                        <IconBrandFacebookFilled color="#fff" size={18} />
                    </Link>
                }
                {
                    company_info?.twitter &&
                    <Link href={company_info?.twitter || "#"} target="_blank">
                        <IconBrandTwitterFilled color='#ffffff' size={18} />
                    </Link>
                }
                {
                    company_info?.instagram &&
                    <Link href={company_info?.instagram || "#"} target="_blank">
                        <IconBrandInstagram color='#ffffff' size={18} />
                    </Link>
                }
                {
                    company_info?.linkedin &&
                    <Link href={company_info?.linkedin || "#"} target="_blank">
                        <IconBrandLinkedinFilled color='#ffffff' size={18} />
                    </Link>
                }
            </div>
        </div >
    )
}

export default Topbarwrapper