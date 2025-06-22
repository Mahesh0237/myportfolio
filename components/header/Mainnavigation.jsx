'use client'
import { IconArrowNarrowRight, IconX } from '@tabler/icons-react';
import Link from 'next/link'
import { usePathname, } from 'next/navigation';
import React from 'react'

function Mainnavigation({ checkIsLogged, handleResetUser }) {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <div className="flex mt-2 lg:mt-0 flex-col lg:flex-row lg:items-center justify-between mx-4 md:mx-8 gap-4 lg:gap-8">
            <Link
                href="/"
                className={`text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] font-roboto ${isActive('/')
                    ? 'text-[#044093] '
                    : 'text-[#2B2B2BCC] opacity-80'
                    }`}
            >
                Home
            </Link>
            <Link
                href="/aboutus"
                className={`text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] font-roboto ${isActive('/aboutus')
                    ? 'text-[#044093] '
                    : 'text-[#2B2B2BCC] opacity-80'
                    }`}
            >
                About
            </Link>
            <Link
                href="/diaries"
                className={`text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] font-roboto ${isActive('/diaries')
                    ? 'text-[#044093] '
                    : 'text-[#2B2B2BCC] opacity-80'
                    }`}
            >
                Diaries
            </Link>
            <Link
                href="/team"
                className={`text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] font-roboto ${isActive('/team')
                    ? 'text-[#044093] '
                    : 'text-[#2B2B2BCC] opacity-80'
                    }`}
            >
                Team
            </Link>
            <Link
                href="/contactus"
                className={`text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] font-roboto ${isActive('/contactus')
                    ? 'text-[#044093] '
                    : 'text-[#2B2B2BCC] opacity-80'
                    }`}
            >
                Contact us
            </Link>
        </div>
    )
}

export default Mainnavigation