
'use client'
import Authapi from '@/components/api/Authapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import config from '@/config';
import { Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Errorpanel from '../shared/Errorpanel';
import Link from 'next/link';

function RegisterPageform() {
    const updateAuthDetails = useUserDetails(state => state.updateAuthDetails);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

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

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const updateFirstName = (e) => {
        setFirstName(e.target.value);
        setFirstNameError('')
    }

    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const updateLastName = (e) => {
        setLastName(e.target.value);
        setLastNameError('')
    }

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const updateEmail = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    }

    const [isFocused, setIsFocused] = useState(false);
    const [phoneCode, setPhoneCode] = useState('91');
    const [phoneCodeError, setPhoneCodeError] = useState(false);
    const updatePhoneCode = (e) => {
        setPhoneCode(e.target.value);
        setPhoneCodeError('')
    }

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const updatePhoneNumber = (e) => {
        setPhoneNumber(e.target.value);
        setPhoneNumberError('')
        if (e.target.value.length > 10) {
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
    }

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const updateConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('')
    }

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const updatePassword = (e) => {
        setPassword(e.target.value);
        setPasswordError('')
    }

    const app_url = config.main_url;
    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);
        if (firstName === '') {
            setIsLoadingEffect(false)
            setFirstNameError('First Name is required');
            return false;
        }
        if (lastName === '') {
            setIsLoadingEffect(false)
            setLastNameError('Last Name is required');
            return false;
        }
        if (email === '') {
            setIsLoadingEffect(false)
            setEmailError('Email is required');
            return false;
        }
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsLoadingEffect(false);
            return false;
        }
        if (phoneCode === '') {
            setIsLoadingEffect(false)
            setPhoneCodeError('Phone code is required');
            return false;
        }
        if (phoneNumber === '') {
            setIsLoadingEffect(false)
            setPhoneNumberError('Phone number is required');
            return false;
        }
        if (phoneNumber?.length !== 10) {
            setIsLoadingEffect(false);
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
        if (phoneNumber?.length > 10) {
            setIsLoadingEffect(false);
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
        const validatePassword = (password) => {
            if (password === '') {
                setPasswordError('Password is required');
                return false;
            }

            // Regular expression pattern
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;

            if (!passwordRegex.test(password)) {
                setPasswordError(
                    'Password must contain:\n' +
                    '- 8+ characters\n' +
                    '- 1 uppercase letter\n' +
                    '- 1 special character (!@#$%^&*)\n' +
                    '- 1 number'
                );
                return false;
            }
            setPasswordError('');
            return true;
        };
        if (!validatePassword(password)) {
            setIsLoadingEffect(false);
            return false;
        }

        let register_data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phoneCode: phoneCode,
            phoneNumber: phoneNumber,
            password: password,
            diaryuid: diaryuid || null,
            diary_access_token: diaryAccessToken || null,
            sender_uid: invitationSenderUid || null
        }
        Authapi.post('/register', register_data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                const data = response.data;
                if (data.status === 'error') {
                    setIsLoadingEffect(false);
                    setErrorMessage(data.message);
                    return false;
                } else if (data.status === 'error_user_exists') {
                    setIsLoadingEffect(false);
                    setErrorMessage(data.message);
                    setEmailError(data.message);
                    return false;
                } else {
                    updateAuthDetails(data.user_details, data.access_token);
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
                                toast.success("Registration Successful", {
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
                            } else {
                                let finalresponse = {
                                    'status': 'error',
                                    'message': data.message,
                                    'server_res': null
                                }
                                setIsLoadingEffect(false);
                                return false;
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
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
                return false;
            })
    }

    return (
        <>
            <form onSubmit={handleRegister} className='relative w-full'>
                <div className="flex flex-row w-full gap-2 pt-2">
                    <div className='flex flex-col gap-1 w-[50%]'>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="First Name"
                            className="w-full border border-gray-300 rounded-sm p-2 text-gray-700 focus:outline-none focus:border-gray-500"
                            autoComplete='off'
                            value={firstName}
                            onChange={updateFirstName}
                        />
                        {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
                    </div>
                    <div className='flex flex-col gap-1 w-[50%]'>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                            className="w-full border border-gray-300 rounded-sm p-2 text-gray-700 focus:outline-none focus:border-gray-500"
                            autoComplete='off'
                            value={lastName}
                            onChange={updateLastName}
                        />
                        {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
                    </div>
                </div>
                <div className="w-full pt-2 flex flex-col gap-y-2">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            id="email"
                            placeholder="Email Address"
                            className="w-full border border-gray-300 rounded-sm p-2 text-gray-700 focus:outline-none focus:border-gray-500"
                            autoComplete='off'
                            value={email}
                            onChange={updateEmail}
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>

                    <div className="flex flex-col space-y-1 w-full">
                        <div className={`flex flex-row justify-start rounded-sm h-10 pl-2 border ${isFocused ? 'border-gray-500' : 'border-gray-300'}`}>
                            <input
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="border-r border-r-gray-500 focus:outline-none p-2"
                                type="text"
                                id="phonecode"
                                value={`+${phoneCode}`}
                                readOnly
                                style={{ width: "10%" }}
                            />
                            <input
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="focus:outline-none p-2"
                                placeholder='Enter Phone Number'
                                type="number"
                                id="phonenumber"
                                value={phoneNumber}
                                onChange={updatePhoneNumber}
                                style={{ width: "92%" }}
                            />
                        </div>
                        {phoneNumberError && <p className='text-[#FF0000] text-[14px] font-[400]'>{phoneNumberError}</p>}
                    </div>


                    <div className="relative">
                        <div className='flex flex-col gap-1'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="password"
                                placeholder="Password"
                                className="w-full border border-gray-200 rounded-sm p-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                autoComplete='off'
                                value={confirmPassword}
                                onChange={updateConfirmPassword}
                            />
                            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                            className="absolute top-4 right-3 flex items-center font-thin"
                        >
                            {showConfirmPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                        </button>
                    </div>

                    <div className="relative">
                        <div className='flex flex-col gap-1'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Confirm Password"
                                className="w-full border border-gray-200 rounded-sm p-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                autoComplete='off'
                                value={password}
                                onChange={updatePassword}
                            />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-4 right-3 flex items-center font-thin"
                        >
                            {showPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                        </button>
                    </div>
                    <button onClick={handleRegister} className="p-2 text-center border rounded-sm !bg-[#044093] text-[#fff] font-[500] w-full cursor-pointer">
                        Signup
                    </button>
                </div>
                <p className="text-[14px] font-[500] pt-2 font-buenosAires text-center">
                    You already have an account?
                    <Link href={redirect ? `/login?redirect=${redirect}` : "/login"} className="cursor-pointer text-[#044093] text-[14px] font-[600] font-buenosAires w-[60%] pl-2">
                        Login
                    </Link>
                </p>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                }
                {
                    errorMessage !== '' &&
                    <Errorpanel
                        errorMessages={errorMessage}
                    />
                }
            </form>
        </>
    )
}

export default RegisterPageform