'use client'
import React, { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import Authapi from '@/components/api/Authapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import { useRouter } from 'next/navigation';
import config from '@/config';
import Errorpanel from '../shared/Errorpanel';

function Loginform({ closeLoginModal, setIsForgotpassword, setIsLoadingEffect }) {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const updateAuthDetails = useUserDetails(state => state.updateAuthDetails);
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const updateEmail = (e) => {
        setEmail(e.target.value);
        setEmailError('');
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
            password: password
        })
            .then((response) => {
                const data = response.data
                if (data.status === 'error') {
                    setIsLoadingEffect(false);
                    let finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse);
                    return false;
                } else if (data.status === 'error_user_not_found') {
                    setEmailError(data.message)
                    setIsLoadingEffect(false);
                    let finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse);
                    return false;
                } else if (data.status === 'error_invalid_password') {
                    setPasswordError(data.message)
                    setIsLoadingEffect(false);
                    let finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse);
                    return false;
                } else {
                    updateAuthDetails(data?.user_details, data?.access_token);
                    const url = `${app_url}/cookiesapi/setcookies/`;
                    const body = {
                        access_token: data.access_token,
                        is_logged: true,
                        uuid: data.user_details?.uuid,
                        user_type: data.user_details?.user_type
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
                                router.push('/');
                                    closeLoginModal();
                                return true;
                            } else {
                                let finalresponse = {
                                    'status': 'error',
                                    'message': data.message,
                                    'server_res': null
                                }
                                setErrorMessage(finalresponse);
                                setIsLoadingEffect(false);
                                return false;
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                            setErrorMessage({
                                status: 'error',
                                message: error.message
                            });
                            setIsLoadingEffect(false);
                            return false;
                        });
                }
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false
            })
    }
    return (
        <>
            <div className='relative w-full'>
                <form onSubmit={handleSubmit} className='space-y-4 w-full pt-4 gap-y-2 flex flex-col items-center justify-center'>
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
                    <div className="relative gap-y-1 mb-0 w-full">
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
                        <div className='flex flex-row-reverse text-left ml-auto mt-1 cursor-pointer' onClick={() => setIsForgotpassword(true)}>
                            <p className='text-[#FF0000CC]/80 text-[14px] font-[400] pt-1'>Forgot Password?</p>
                        </div>
                    </div>
                    <button type='submit' className='p-2 text-center border rounded-sm !bg-[#044093] text-[#fff] font-[500] w-full cursor-pointer'>
                        Login
                    </button>
                </form>
                {/* {
                    errorMessage !== '' &&
                    <Errorpanel
                        errorMessages={errorMessage}
                    />
                } */}
            </div>
        </>
    )
}

export default Loginform