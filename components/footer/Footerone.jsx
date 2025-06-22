'use client'
import Image from 'next/image'
import logo from '@/public/assets/logo.svg'
import React from 'react'
import youtube from '@/public/assets/youtube-blue.svg'
import facebook from '@/public/assets/facebook-blue.svg'
import linkedin from '@/public/assets/linkedIn-blue.svg'
import instagram from '@/public/assets/instagram-blue.svg'
import Link from 'next/link'
import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandLinkedinFilled, IconBrandTwitterFilled, IconBrandYoutubeFilled, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import { useCompanyinfo } from '../zustand/useCompanyinfo'

function Footerone() {
    const company_info = useCompanyinfo((state) => state.company_info);
    return (
        <div className="flex flex-col items-center md:items-start justify-start gap-6 px-[3.3vw] pb-6 w-full mx-auto h-fit bg-[#FFF] pt-[6vh]">
            <div className='flex flex-col md:grid md:grid-cols-1 lg:grid-cols-2 border-[#D9DBE9] border-b-[1.3px] w-full py-3 pb-10'>
                {/* First Column - Logo, Text, Social */}
                <div className='flex flex-col items-center md:items-start col-span-1 gap-5 w-full md:w-auto'>
                    <Link href="/" className='w-full flex justify-center md:justify-start'>
                        <Image src={company_info?.light_logo || logo}
                            alt="LOGO"
                            height={160}
                            width={160}
                            style={{ height: 'auto', width: 'auto' }}
                            className="object-contain"
                        />
                    </Link>
                    <p className="text-[#2B2B2B]/60 font-inter text-[16px] md:text-[16px] font-[400] w-full md:w-[45%] text-center md:text-left 2xl:text-[22px]">
                        Diarysouls is a concept that is born with a thought that every human has a diary for their soul, which is worth cherishing.
                    </p>
                    <div className='flex gap-[20px] items-center justify-center md:justify-start w-full md:w-auto'>
                        {
                            company_info?.facebook &&
                            <Link href={company_info?.facebook || "#"} target="_blank">
                                <IconBrandFacebookFilled color='#044093' size={25} />
                            </Link>
                        }
                        {
                            company_info?.twitter &&
                            <Link href={company_info?.twitter || "#"} target="_blank">
                                <IconBrandTwitterFilled color='#044093' size={25} />
                            </Link>
                        }
                        {
                            company_info?.instagram &&
                            <Link href={company_info?.instagram || "#"} target="_blank">
                                <IconBrandInstagramFilled color='#044093' size={25} />
                            </Link>
                        }
                        {
                            company_info?.linkedin &&
                            <Link href={company_info?.linkedin || "#"} target="_blank">
                                <IconBrandLinkedinFilled color='#044093' size={25} />
                            </Link>
                        }
                        {
                            company_info?.youtube &&
                            <Link href={company_info?.youtube || "#"} target="_blank">
                                <IconBrandYoutubeFilled color='#044093' size={25} />
                            </Link>
                        }
                    </div>
                </div>

                {/* Second Column - Links */}
                <div className='col-span-1 mt-8 md:mt-0'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-6 md:gap-0'>
                        {/* Company Links */}
                        <div className='col-span-1 flex flex-col items-center sm:items-start justify-start space-y-3 md:space-y-[1vw]'>
                            <p className="text-[18px] text-[#044093] font-sans font-[600] 2xl:text-[26px]">
                                Company
                            </p>
                            <Link href="/aboutus" className="text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                About us
                            </Link>
                            <Link href="/diaries" className="text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                Dairies
                            </Link>
                            <Link href="/team" className="text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                Team
                            </Link>
                            <Link href="#" className="text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                Blog
                            </Link>
                            <Link href="/contactus" className="text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                Contact us
                            </Link>
                        </div>

                        {/* Contact Info */}
                        <div className='col-span-1 sm:col-span-1 md:col-span-2 flex flex-col items-center sm:items-start justify-start space-y-3 md:space-y-[1vw] w-full'>
                            <p className="text-[18px] text-[#044093] font-sans font-[600] 2xl:text-[26px]">
                                Contact us
                            </p>
                            <p className="text-[16px] text-[#2B2B2B] font-sans font-[400] flex items-center 2xl:text-[22px]">
                                <IconMail size={18} stroke={1.5} className="mr-2" />
                                {company_info?.email || ""}
                            </p>
                            <p className="flex items-center text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                <IconPhone size={18} stroke={1.5} className="mr-2" />{company_info?.phone_code || "+91"} {company_info?.phone || ""}
                            </p>
                            <p className="flex flex-col sm:flex-row items-center sm:items-start text-[16px] text-[#2B2B2B] font-sans font-[400] 2xl:text-[22px]">
                                <span className="flex items-center">
                                    <IconMapPin size={18} stroke={1.5} className="mr-2" />
                                </span>
                                <span>{company_info?.address_line1 || company_info?.address_line2 || ""}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-0">
                <p className="text-[#2B2B2B] font-sans text-[12px] md:text-[16px] font-[500] order-2 sm:order-1 2xl:text-[20px]">
                    Copyright © 2025 Diarysouls. All rights reserved.
                </p>
                <p className="text-[#2B2B2B] font-sans text-[12px] md:text-[16px] font-[500] text-center sm:text-end order-1 sm:order-2 2xl:text-[20px]">
                    <Link href="#" className="text-[#044093]">Terms and Conditions</Link>
                    {" | "}
                    <Link href="#" className="text-[#044093]">Privacy Policy</Link>
                </p>
            </div>
        </div >
    )
}

export default Footerone

