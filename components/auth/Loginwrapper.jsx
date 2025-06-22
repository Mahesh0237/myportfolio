'use client'
import Image from 'next/image';
import React, { useState } from 'react'
import logo from '@/public/assets/logo.svg'
import Loginform from './Loginform';
import { IconCancel, IconX } from '@tabler/icons-react';
import Forgetpasswordform from './Forgetpasswordform';
import { Loadingoverlay } from '@nayeshdaggula/tailify';

function Loginwrapper({ openRegisterModal, closeLoginModal, company_info }) {
    const [isForgotpassword, setIsForgotpassword] = useState(false);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    return (
        <>
            <div className="flex flex-col items-center justify-center px-5 py-2 w-full rounded-xl pb-5">
                <Image
                    // src={logo}
                    // alt='logo'
                    // className='h-[100px] w-[110px] object-contain'
                    src={company_info?.light_logo || logo}
                    alt="LOGO"
                    height={160}
                    width={160}
                />
                {isForgotpassword ? (
                    <Forgetpasswordform
                        setIsForgotpassword={setIsForgotpassword}
                    />
                ) :
                    <>
                        <p className='text-[18px] font-[600] text-black'>
                            Login
                        </p>
                        <Loginform
                            closeLoginModal={closeLoginModal}
                            setIsForgotpassword={setIsForgotpassword}
                            setIsLoadingEffect={setIsLoadingEffect}
                        />
                        <p className="text-[14px] font-[500] pt-2 font-buenosAires text-center">
                            Don't have an account?
                            <span onClick={openRegisterModal} className="cursor-pointer text-[#f7941d] text-[14px] font-[600] font-buenosAires w-[60%] pl-2">
                                Signup
                            </span>
                        </p>
                        {/* close Icon */}
                        <button
                            onClick={closeLoginModal}
                            className="absolute top-3 right-3 text-[#000000] font-[400] text-[14px] cursor-pointer"
                        >
                            <IconX size={20} />
                        </button>
                    </>
                }
            </div>
            {
                isLoadingEffect &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                </div>
            }
        </>
    )
}

export default Loginwrapper