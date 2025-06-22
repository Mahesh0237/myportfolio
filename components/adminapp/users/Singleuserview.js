import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import avatar from '@/public/assets/avatar.jpg';
import Image from 'next/image';
import Userapi from '@/components/api/Userapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { Loadingoverlay } from '@nayeshdaggula/tailify';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
const Changepassword = dynamic(() => import('./Changepassword'), { ssr: false });

function Singleuserview({ closeSingleuserview, singleuserUId, openEditusermodal, setRefreshStatus, refreshStatus }) {
    const access_token = useEmployeDetails(state => state.access_token);
    const [activeProfileTab, setActiveProfileTab] = useState('personalinfo');
    const profiletabChange = (tab) => {
        setActiveProfileTab(tab);
    }

    const closedrawer = () => {
        closeSingleuserview();
        setActiveProfileTab('personalinfo');
    };

    const [userdata, setUserdata] = useState({});
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getSingleUser(singleUseruid) {
        Userapi.get('/getsingleuserdata', {
            params: {
                single_user_uid: singleUseruid
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
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
                if (data?.user_details !== null) {
                    setUserdata(data?.user_details || {});
                }
                setIsLoadingEffect(false);
                return false;
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
    }

    useEffect(() => {
        setIsLoadingEffect(true);
        getSingleUser(singleuserUId);
    }, [singleuserUId]);

    useEffect(() => {
        if (refreshStatus) {
            setIsLoadingEffect(true);
            getSingleUser(singleuserUId);
            setRefreshStatus(false);
        }
    }, [refreshStatus]);

    return (
        <div className=' flex flex-col w-full'>
            <div className="flex flex-row justify-between items-center px-4 py-4 border-b-[1.5px]">
                <div className='flex flex-row items-center gap-2 '>
                    <Image src={avatar} alt="avatar" width={50} height={50} className='rounded-full' />
                    <div>
                        <p className='max-sm:text-[14px] md:text-[16px] text-[#2B2B2B]'>{userdata.first_name} </p>
                    </div>
                </div>
                <div className="flex flex-row gap-x-3">
                    <button
                        onClick={() => openEditusermodal(singleuserUId)}
                        className="flex justify-center items-center relative gap-2.5 px-5 py-1.5 cursor-pointer rounded-sm bg-[#044093]"
                    >
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                            Edit
                        </p>
                    </button>
                    <button onClick={closedrawer} className='cursor-pointer'>
                        <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[18px] h-[18px] relative "
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path
                                d="M0.642822 9H13.5M13.5 9L8.99997 13.5M13.5 9L8.99997 4.5M17.3571 4.5V13.5"
                                stroke="#044093"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex justify-start items-center gap-6 mt-3.5 px-[20px]">
                <div
                    onClick={() => profiletabChange('personalinfo')}
                    className="justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-[3px] cursor-pointer"
                >
                    <p
                        className={`${activeProfileTab === 'personalinfo'
                            ? 'font-[500] text-[#000]'
                            : 'font-[500] text-[#000]/70'
                            } flex-grow-0 flex-shrink-0 text-[16px] text-left`}
                    >
                        Personal Info
                    </p>
                    {activeProfileTab === 'personalinfo' ? (
                        <div className="h-[0.09rem] bg-black rounded-full w-full flex mt-1" />
                    ) : (
                        <div className="h-[0.09rem] bg-transparent rounded-full w-full flex mt-1" />
                    )}
                </div>
                <div
                    onClick={() => profiletabChange('changepassword')}
                    className="justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[3px] cursor-pointer"
                >
                    <p
                        className={`${activeProfileTab === 'changepassword'
                            ? 'font-[500] text-[#000]'
                            : 'font-[500] text-[#000]/70'
                            } flex-grow-0 flex-shrink-0 text-[16px] text-left`}
                    >
                        Change Password
                    </p>
                    {activeProfileTab === 'changepassword' ? (
                        <div className="h-[0.09rem] bg-black rounded-full w-full flex mt-1" />
                    ) : (
                        <div className="h-[0.09rem] bg-transparent rounded-full w-full flex mt-1" />
                    )}
                </div>
            </div>
            {activeProfileTab === 'personalinfo' && (
                <div className='relative'>
                    <div className="flex flex-col justify-start items-start gap-4 p-5">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                            <p className="flex-grow-0 flex-shrink-0 w-[150px] text-sm text-left text-[#2b2b2b]">
                                Full Name
                            </p>
                            <p className="flex justify-start items-center relative gap-1.5 flex-grow-0 flex-shrink-0 text-sm text-left text-[#2b2b2b]">
                                {userdata.first_name}
                            </p>
                        </div>


                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                            <p className="flex-grow-0 flex-shrink-0 w-[150px] text-sm text-left text-[#2b2b2b]">
                                Email Address
                            </p>
                            <p className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1.5 text-sm text-left text-[#2b2b2b]">
                                {userdata.email}
                            </p>
                        </div>
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                            <p className="flex-grow-0 flex-shrink-0 w-[150px] text-sm text-left text-[#2b2b2b]">
                                Phone Number
                            </p>
                            {userdata.phone_number === null || userdata.phone_number === '' || userdata.phone_number === undefined ?
                                <p className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1.5 text-sm text-left text-[#2b2b2b]">
                                    ---
                                </p>
                                :
                                <p className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1.5 text-sm text-left text-[#2b2b2b]">
                                    +{userdata.phone_code} {userdata.phone_number}
                                </p>
                            }
                        </div>

                        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
                            <p className="flex-grow-0 flex-shrink-0 w-[150px] text-sm text-left text-[#2b2b2b]">
                                Status
                            </p>
                            {
                                userdata.status === 'Inactive' ?
                                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fdecec] w-fit">
                                        <svg
                                            width={9}
                                            height={8}
                                            viewBox="0 0 9 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                            preserveAspectRatio="xMidYMid meet"
                                        >
                                            <circle cx="4.42871" cy={4} r={3} fill="#EC0606" />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#ec0606]">
                                            Inactive
                                        </p>
                                    </div>
                                    : userdata.status === 'Active' ?
                                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#ecfdf3] w-fit">
                                            <svg
                                                width={9}
                                                height={8}
                                                viewBox="0 0 9 8"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                <circle cx="4.42871" cy={4} r={3} fill="#14BA6D" />
                                            </svg>
                                            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#037847]">Active</p>
                                        </div>
                                        : userdata.status === 'Suspended' &&
                                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#D6D6D6] w-fit">
                                            <svg
                                                width={9}
                                                height={8}
                                                viewBox="0 0 9 8"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                <circle cx="4.42871" cy={4} r={3} fill="#434343" />
                                            </svg>
                                            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#434343]">
                                                Suspended
                                            </p>
                                        </div>
                            }
                        </div>
                    </div>
                    {
                        isLoadingEffect &&
                        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                        </div>
                    }
                </div>
            )}
            {
                activeProfileTab === 'changepassword' && (
                    <Changepassword singleuserUId={singleuserUId} closeSingleuserview={closeSingleuserview} />
                )}
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </div>
    )
}

export default Singleuserview