import Image from 'next/image';
import React from 'react'
import logo from '@/public/assets/logo.svg';
import Registerform from './Registerform';
import { IconX } from '@tabler/icons-react';

function Registerwrapper({ openLoginModal, closeRegisterModal, company_info }) {

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full rounded-xl">
                {/* Logo Section */}
                <Image
                    // src={logo}
                    // alt="LOGO"
                    // className="h-[100px] w-[110px] object-contain"
                    src={company_info?.light_logo || logo}
                    alt="LOGO"
                    height={160}
                    width={160}
                />
                {/* Title Section */}
                <p className="text-[18px] md:text-[18px] 2xl:text-[22px] 3xl:text-[26px] 4xl:text-[30px] font-[600] text-black">
                    Signup
                </p>
                <Registerform
                    closeRegisterModal={closeRegisterModal}
                />
                <p className="text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[500] pt-2 text-center">
                    You already have an account?
                    <span onClick={openLoginModal} className="cursor-pointer text-[#f7941d] text-[14px] font-[600] pl-2">
                        Login
                    </span>
                </p>
                <button
                    onClick={closeRegisterModal}
                    className="absolute top-3 right-3 text-[#000000] font-[400] cursor-pointer"
                >
                    <IconX size={20} />
                </button>
            </div>
        </>
    )
}

export default Registerwrapper
