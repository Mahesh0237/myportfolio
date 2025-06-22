'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import config from '@/config';
import Authapi from '@/components/api/Authapi';
import { toast } from 'react-toastify';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import Errorpanel from '@/components/shared/Errorpanel';
import { Loadingoverlay } from '@nayeshdaggula/tailify';

function LoginPageform() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)

    const updateAuthDetails = useUserDetails(state => state.updateAuthDetails);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [diaryuid, setDiaryuid] = useState(null);
    const [diaryAccessToken, setDiaryAccessToken] = useState(null);
    const [invitationSenderUid, setInvitationSenderUid] = useState(null);
    useEffect(() => {
        const redirectParam = searchParams.get('redirect');

        if (redirectParam) {
            const decoded = decodeURIComponent(redirectParam); // e.g. "/diarydetails/DSD524442?diary_access_token=...&sender_uid=..."

            const url = new URL(`${config.main_url}${decoded}`); // create a valid URL object
            const pathParts = url.pathname.split('/');
            const diaryUidFromPath = pathParts[2]; // e.g. "DSD524442"

            const diaryToken = url.searchParams.get('diary_access_token');
            const sender = url.searchParams.get('sender_uid');

            setDiaryuid(diaryUidFromPath);
            setDiaryAccessToken(diaryToken);
            setInvitationSenderUid(sender);
        }
    }, [searchParams]);
    const redirect = searchParams.get("redirect");
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const updateEmail = (e) => {
        setEmail(e.target.value)
        setEmailError('')
    }

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const updatePassword = (e) => {
        setPassword(e.target.value)
        setPasswordError('')
    }
    let app_url = config.main_url;
    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoadingEffect(true)
        if (email === '') {
            setIsLoadingEffect(false)
            setEmailError('Email is required')
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsLoadingEffect(false);
            return false;
        }

        if (password === '') {
            setIsLoadingEffect(false)
            setPasswordError('Password is required')
            return false;
        }

        Authapi.post('/login', {
            email: email,
            password: password,
            diaryuid: diaryuid || null,
            diary_access_token: diaryAccessToken || null,
            sender_uid: invitationSenderUid || null
        }).then((response) => {
            const data = response.data
            if (data.status === 'error') {
                let finalresponse = {
                    status: 'error',
                    message: data.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            } else if (data.status === 'error_user_not_found') {
                setEmailError(data.message)
                setIsLoadingEffect(false);
                let finalresponse = {
                    status: 'error',
                    message: data.message
                }
                setErrorMessage(finalresponse);
                return false;
            } else if (data.status === 'error_invalid_password') {
                setPasswordError(data.message)
                setIsLoadingEffect(false);
                let finalresponse = {
                    status: 'error',
                    message: data.message
                }
                setErrorMessage(finalresponse);
                return false;
            } else {
                updateAuthDetails(data?.user_details, data?.access_token);
                const url = `${app_url}/cookiesapi/setcookies/`;
                const body = {
                    access_token: data.access_token,
                    is_logged: true,
                    uuid: data.user_details.uuid,
                    user_type: data.user_details.user_type
                };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.status === 'success') {
                            toast.success("Login Successfull", {
                                position: 'top-right',
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            router.push(redirect || "/");
                            setTimeout(() => {
                                setIsLoadingEffect(false);
                            }, 2000);
                            return true;
                        } else if (data.status === 'error') {
                            let finalresponse = {
                                status: 'error',
                                message: data.message
                            }
                            setErrorMessage(finalresponse);
                            setIsLoadingEffect(false);
                            return false;
                        }
                    })
                    .catch(error => {
                        let finalresponse = {
                            status: 'error',
                            message: error.message
                        }
                        setErrorMessage(finalresponse);
                        setIsLoadingEffect(false);
                        return false;
                    });
            }
        }).catch((error) => {
            let finalresponse = {
                status: 'error',
                message: error.message
            }
            setErrorMessage(finalresponse)
            setIsLoadingEffect(false);
            return false;
        })
    }
    return (
        <>
            <form onSubmit={handleSubmit} className='relative w-full'>
                <div className='space-y-2 w-full pt-4 gap-y-2 flex flex-col items-center justify-center'>
                    <div className="flex flex-col space-y-1 w-full">
                        <input
                            type="text"
                            id="username"
                            placeholder="Email Address"
                            className="w-full border border-gray-300 rounded-sm p-2 text-gray-700 focus:outline-none "
                            autoComplete='off'
                            value={email}
                            onChange={updateEmail}
                        />
                        {emailError && <p className='text-[#FF0000CC]/80 text-[14px] font-[400]'>{emailError}</p>}
                    </div>
                    <div className="relative gap-y-1 w-full">
                        <div className='flex flex-col gap-1'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                className="w-full border border-gray-300 rounded-sm p-2 text-gray-700 focus:outline-none "
                                autoComplete='off'
                                value={password}
                                onChange={updatePassword}
                            />
                            {passwordError && <p className='text-[#FF0000CC]/80 text-[14px] font-[400]'>{passwordError}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-4 right-3 flex items-center font-thin"
                        >
                            {showPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                        </button>
                        <Link href={"#"} className='flex flex-row-reverse'>
                            <p className='text-[#FF0000CC]/80 text-[14px] font-semibold pt-1'>Forgot Password?</p>
                        </Link>
                    </div>
                    <button onClick={handleSubmit} className='p-2 text-center border rounded-sm bg-[#044093] text-[#fff] font-[500] w-full cursor-pointer'>
                        Login
                    </button>
                </div>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                }
            </form>
            <p className="text-[14px] font-[500] pt-2 font-buenosAires text-center">
                Don't have an account?
                <Link href={redirect ? `/register?redirect=${redirect}` : "/register"} className="cursor-pointer text-[#044093] text-[14px] font-[600] font-buenosAires w-[60%] pl-2">
                    Signup
                </Link>
            </p>
            {errorMessage !== '' && <Errorpanel errorMessages={errorMessage} />}
        </>
    )
}

export default LoginPageform