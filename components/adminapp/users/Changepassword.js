'use client'
import React, { useState } from 'react';
import { Button, Loadingoverlay, Passwordinput } from '@nayeshdaggula/tailify'
import { toast } from 'react-toastify';
import Userapi from '@/components/api/Userapi';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import Errorpanel from '@/components/shared/Errorpanel';
function Changepassword({ singleuserUId, closeSingleuserview }) {
    const access_token = useEmployeDetails(state => state.access_token);
    const [newpassword, setNewPassword] = useState('');
    const [newpassworderror, setNewpassworderror] = useState('');
    const updateNewPassword = (e) => {
        setNewPassword(e.target.value);
        setNewpassworderror('');
    }

    const [confirmpassword, setConfirmpassword] = useState('');
    const [confirmpassworderror, setConfirmpassworderror] = useState('');
    const updateConfirmPassword = (e) => {
        setConfirmpassword(e.target.value);
        setConfirmpassworderror('');
    }

    const [errorMessage, setErrorMessage] = useState('');

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const submitpassword = () => {
        setIsLoadingEffect(true);

        if (newpassword === '') {
            setNewpassworderror('New Password is required');
            setIsLoadingEffect(false);
            return false;
        }
        if (newpassword !== confirmpassword) {
            setConfirmpassworderror('Password does not match');
            setIsLoadingEffect(false);
            return false;
        }
        Userapi.post('updateuserpassword', {
            password: newpassword,
            singleuser_uid: singleuserUId,
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success('updated password successfully')
                setIsLoadingEffect(false);
                setConfirmpassword('');
                setNewPassword('');
                closeSingleuserview();
                return false
            })
            .catch((error) => {
                console.log(error)
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
                closeSingleuserview();
                return false;
            });
    };
    return (
        <div className="p-5 space-y-4 relative">
            <Passwordinput
                label="New Password"
                labelClassName='text-sm font-normal'
                inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                placeholder='Enter New Password'
                value={newpassword}
                onChange={updateNewPassword}
                error={newpassworderror}
                className='mb-3'
            />
            <Passwordinput
                label="Confirm Password"
                labelClassName='text-sm font-normal'
                inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                placeholder='Confirm New Password'
                value={confirmpassword}
                onChange={updateConfirmPassword}
                error={confirmpassworderror}
                className='mb-5'
            />
            <Button onClick={submitpassword} disabled={isLoadingEffect} className=" !flex justify-center items-center !ml-auto !px-5 !py-1.5 mt-2 rounded !bg-[#044093] !max-md:w-full">
                Change Password
            </Button>
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
        </div>
    )
}

export default Changepassword