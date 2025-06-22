import { Button, Card, Loadingoverlay, Select } from '@nayeshdaggula/tailify';
import { IconSearch, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import Userapi from '@/components/api/Userapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import Errorpanel from '@/components/shared/Errorpanel';
import Diariesapi from '@/components/api/Diariesapi';
import { toast } from 'react-toastify';

function Invitationmodaltogroupmember({ closeDiaryinvitationModaltoGroup, diary_id }) {
    const user_info = useUserDetails((state) => state.user_info);
    const user_id = user_info?.user_id || null;
    const access_token = useUserDetails((state) => state.access_token);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState('')
    const [userError, setUserError] = useState('')
    const updateUser = (value) => {
        setUserError('')
        if (value.length > 2) {
            getSearchedUsers({ input: value })
            setShowDropdown(true)
        } else {
            setAllUsers([])
        }
        if (value === '') {
            setAllUsers([])
            setShowDropdown(false)
        }
        setUser(value)
    }
    const [allUsers, setAllUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);
    const handleUserSelect = (username, userid) => {
        setUser(username);
        setSelectedUser(userid);
        setShowDropdown(false);
    };

    const [errorMessage, setErrorMessage] = useState('')
    const [isUserLoading, setIsUserLoading] = useState(false)
    function getSearchedUsers({ input }) {
        setIsUserLoading(true)
        Userapi.get('/searchusers', {
            params: {
                user_id: user_id,
                searchQuery: input
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(response => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setErrorMessage(finalresponse);
                    setIsUserLoading(false)
                    return false;
                }
                setIsUserLoading(false)
                setAllUsers(data?.users || []);
                return false;
            })
            .catch((error) => {
                console.log(error)
                setIsUserLoading(false)
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
                return false;
            })
    }

    const [isLoadingEffect, setIsLoadingEffect] = useState(false)
    const handleSubmitInvitation = () => {
        setIsLoadingEffect(true)
        // if (user === '') {
        //     setUserError('Please select user')
        //     setIsLoadingEffect(false)
        //     return false
        // }
        if (selectedUser === null) {
            setUserError('Please select user')
            setIsLoadingEffect(false)
            return false
        }

        Diariesapi.post('/senddiaryinvitationtogroupmember', {
            sender_user_id: user_id,
            diaryid: diary_id,
            invited_user_id: selectedUser
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
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
                toast.success('Invitation Sent Successfully', {
                    position: "top-right",
                    autoClose: 3000,
                })
                setIsLoadingEffect(false);
                closeDiaryinvitationModaltoGroup();
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
            })
    }

    return (
        <div className='relative'>
            <Card padding='0' margin='0' className='w-[100%] max-sm:w-[100%] max-sm:rounded-none max-sm:!border-0 max-sm:shadow-none'>
                <Card.Section className='!px-4 !py-2'>
                    <div className="flex justify-between items-center">
                        <p className="text-[#044093] text-[16px] font-semibold max-sm:text-[16px] md:text-xl 2xl:text-[30px]">Diary Invitation to Group Member</p>
                        <Button variant="default" onClick={closeDiaryinvitationModaltoGroup} className='!px-0 focus:outline-none border-none '>
                            <IconX size={20} color='#044093' />
                        </Button>
                    </div>
                </Card.Section>
                <Card.Section className='!px-4 !border-b-1 '>
                    <div className='flex flex-col gap-1'>
                        <div className='bg-[#e5edf6] rounded-md flex flex-col items-center px-3 py-[6px] 2xl:py-[9px]'>
                            <p className='text-[#ff0000] text-[14px] font-sans font-semibold 2xl:text-[26px]'>Note</p>
                            <p className='text-[14px] font-sans 2xl:text-[24px] 2xl:text-center'>
                                You can only send invitations to registered users. To invite non-registered users, please use the "Share by Link" button.
                            </p>
                        </div>
                        <p className='text-[16px] font-medium font-sans 2xl:text-[26px]'>Search User</p>
                        <div className='shadow-[0px_0px_10px_rgba(0,0,0,0.1)] bg-white rounded-[5px]'>
                            <input
                                type='text'
                                value={user}
                                onChange={(e) => updateUser(e.target.value)}
                                placeholder='Search with user name or email or phone number'
                                className='w-full border border-[#1d3a7675] rounded-md px-3 py-[6px] focus:outline-none focus:ring-1 focus:ring-[#1d3a7675] focus:border-[#1d3a7675] bg-[#f9fafb] 2xl:text-[26px]'
                            />
                        </div>
                    </div>
                    {userError && <p className='text-red-500 text-[10px] mt-2 '>{userError}</p>}
                    {
                        // isUserLoading ?
                        //     <div className='w-full flex justify-center items-center'>
                        //         <div className='w-5 h-5 border-2 border-t-2 border-[#1D3A76] rounded-full animate-spin'></div>
                        //         <p className='text-[#1D3A76] text-[13px] font-medium font-sans ml-2'>Fetching Users...</p>
                        //     </div>
                        //     :
                        showDropdown && (
                            allUsers.length > 0 ? (
                                <ul className='w-full bg-white border border-[#1D3A76] rounded-md shadow-lg max-h-48 overflow-auto z-50 mt-1'>
                                    {allUsers.map((user, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleUserSelect(user?.label, user?.value)}
                                            className='px-4 py-2 cursor-pointer hover:bg-[#1D3A76] hover:text-white'
                                        >
                                            {user.label}
                                        </li>
                                    ))}
                                </ul>
                            )
                                :
                                <div className='w-full bg-white border border-[#1D3A76] rounded-md shadow-lg max-h-48 overflow-auto z-50 mt-1'>
                                    <p className='text-[#1D3A76] text-[13px] font-medium font-sans px-4 py-2 text-center 2xl:text-[22px]'>No users found</p>
                                </div>
                        )
                    }
                </Card.Section>

                <Button
                    onClick={handleSubmitInvitation}
                    className="cursor-pointer !flex justify-end !px-4 !mx-4 my-2 !ml-auto !text-[13px] !bg-[#044093] !text-white !py-2 2xl:!text-[25px] 2xl:font-normal">
                    Send Invitation
                </Button>
            </Card>
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
    );
}

export default Invitationmodaltogroupmember;
