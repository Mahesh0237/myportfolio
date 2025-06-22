import Authapi from '@/components/api/Authapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { Loadingoverlay, Passwordinput, Textinput } from '@nayeshdaggula/tailify';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Forgetpasswordform({ setIsForgotpassword }) {
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const updateEmail = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    }

    const [errorMessage, setErrorMessage] = useState();
    const [isUserExists, setIsUserExists] = useState(false);

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (email === '') {
            setEmailError('Email is required');
            setIsLoadingEffect(false);
            return false;
        }

        // Email validation main domain and sub domain
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsLoadingEffect(false);
            return false;
        }

        Authapi.get('/isuserexists', {
            params: {
                email: email
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    setEmailError(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                setErrorMessage('');
                setIsUserExists(data.is_userexist);
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
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
            });
    }

    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState('')
    const updateOtp = (e) => {
        setOtp(e.target.value);
        setOtpError('');
    }

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const updateNewPassword = (e) => {
        setNewPassword(e.target.value);
        setNewPasswordError('');
    }

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const updateConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
    }

    const [sucess, setSucess] = useState(false);

    const resetPassword = async (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (otp === '') {
            setOtpError('OTP is required');
            setIsLoadingEffect(false);
            return false;
        }

        if (newPassword === '') {
            setNewPasswordError('New password is required');
            setIsLoadingEffect(false);
            return false;
        }

        if (confirmPassword === '') {
            setConfirmPasswordError('Confirm password is required');
            setIsLoadingEffect(false);
            return false;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Password does not match');
            setIsLoadingEffect(false);
            return false;
        }

        Authapi.post('/resetpassword', {
            email: email,
            otp: otp,
            new_password: newPassword
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setOtpError(finalresponse.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                setSucess(true);
                toast.success("Password reset successfully", {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    setIsForgotpassword(false);
                }, 3000);
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
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
            });
    }

    return (

        <div className="w-full">
            {isUserExists ?
                sucess ?
                    <div className="flex flex-col gap-4">
                        <p className="text-[#282828] text-lg font-semibold">Password reset successfully</p>
                        <p className="text-[#282828] text-base font-medium">Please wait while we redirect you to login page</p>
                        <button
                            onClick={() => setIsForgotpassword(false)}
                            className="w-full h-[39px] relative overflow-hidden rounded !bg-[#00AEEF] text-white cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>
                    :
                    <form className="lg:space-y-4 md:space-y-3 space-y-2">
                        <p className='text-[16px] font-[600] text-black text-center'>
                            The OTP has been sent to your email address.
                        </p>
                        <Textinput
                            label="OTP"
                            placeholder="Enter OTP"
                            required
                            type="number"
                            value={otp}
                            onChange={updateOtp}
                            error={otpError}
                        />
                        <Passwordinput
                            label="New Password"
                            placeholder="Enter your new password"
                            required
                            type="password"
                            value={newPassword}
                            onChange={updateNewPassword}
                            error={newPasswordError}
                        />
                        <Passwordinput
                            label="Confirm Password"
                            placeholder="Enter your new password again"
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={updateConfirmPassword}
                            error={confirmPasswordError}
                        />
                        <button
                            onClick={resetPassword}
                            type="submit"
                            className="flex-grow-0 flex-shrink-0 w-full h-[39px] relative overflow-hidden rounded !bg-[#00AEEF] text-white cursor-pointer"
                        >
                            Submit Password
                        </button>
                        <div className="flex justify-end">
                            <div className='flex flex-row items-center gap-2'>
                                <IconArrowNarrowLeft />
                                <button onClick={() => setIsForgotpassword(false)} className="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#2b2b2b] cursor-pointer">
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </form>
                :
                <form onSubmit={handleForgetPassword} className="lg:space-y-4 md:space-y-3 space-y-2">
                    <p className='text-[16px] font-[600] text-black text-center'>
                        Enter email address to reset your password.
                    </p>
                    <Textinput
                        label="Email address"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={updateEmail}
                        error={emailError}
                    />
                    <button
                        onClick={handleForgetPassword}
                        type="submit"
                        className="flex-grow-0 flex-shrink-0 w-full h-[39px] relative overflow-hidden rounded !bg-[#044093] text-white cursor-pointer"
                    >
                        Submit Email
                    </button>
                    <div className="flex justify-end">
                        <div className='flex flex-row items-center gap-2'>
                            <IconArrowNarrowLeft />
                            <button onClick={() => setIsForgotpassword(false)} className="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#2b2b2b] cursor-pointer">
                                Back to Login
                            </button>
                        </div>
                    </div>
                </form>
            }
            {isLoadingEffect &&
                <Loadingoverlay visible={isLoadingEffect} overlayBg='#2b2b2bcc' />
            }
            {
                errorMessage &&
                <Errorpanel errorMessages={errorMessage} />
            }
        </div>
    )
}

export default Forgetpasswordform