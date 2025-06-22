import React, { useState } from 'react';
import { Button, Card, Loadingoverlay, Passwordinput } from '@nayeshdaggula/tailify'
import { toast } from 'react-toastify';
import Userapi from '@/components/api/Userapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import Errorpanel from '@/components/shared/Errorpanel';
import { IconX } from '@tabler/icons-react';

function Changepassword({ closeChangePasswordView }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const user_uid = userInfo?.uuid;

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
            singleuser_uid: user_uid,
        },
            // {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${access_token}`
            //     }
            // }
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
                setErrorMessage('');
                toast.success('Password updated successfully');
                closeChangePasswordView();
                setIsLoadingEffect(false);
                setConfirmpassword('');
                setNewPassword('');
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
                return false;
            });

    };
    return (
        <>
            <Card padding='0px'>
                <Card.Section className='flex justify-between items-center'>
                    <p className='font-semibold text-[18px] 2xl:text-[32px]'>Change Password</p>
                    <IconX onClick={closeChangePasswordView} width={24} height={24} className='cursor-pointer'/>
                </Card.Section>
                <Card.Section className='gap-y-2 flex flex-col max-h-[70vh] overflow-y-auto'>
                    <Passwordinput
                        label="New Password"
                        // labelClassName='text-sm font-normal 2xl:text-[26px]'
                        labelClassName='2xl:text-[24px] 2xl:!font-normal'
                        inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none 2xl:text-[26px]'
                        placeholder='Enter New Password'
                        value={newpassword}
                        onChange={updateNewPassword}
                        error={newpassworderror}
                        className='mb-3'
                    />
                    <Passwordinput
                        label="Confirm Password"
                        // labelClassName='text-sm font-normal 2xl:text-[26px]'
                        labelClassName='2xl:text-[24px] 2xl:!font-normal'
                        inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none 2xl:text-[26px]'
                        placeholder='Confirm New Password'
                        value={confirmpassword}
                        onChange={updateConfirmPassword}
                        error={confirmpassworderror}
                        className='mb-5'
                    />
                </Card.Section>
                <Card.Section className='flex justify-end !py-2 !px-3'>
                    <Button onClick={submitpassword} disabled={isLoadingEffect} className=" !flex justify-center items-center !ml-auto !px-5 !py-1.5 rounded !bg-[#044093] !max-md:w-full text-sm 2xl:text-[24px]">
                        Change Password
                    </Button>
                </Card.Section>
            </Card>
            {
                isLoadingEffect &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                </div>
            }
            {errorMessage && <Errorpanel errorMessages={errorMessage} />}
        </>
    )
}

export default Changepassword;