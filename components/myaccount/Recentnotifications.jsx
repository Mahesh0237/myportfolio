import Notificationapi from '@/components/api/Notificationapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import { Card } from '@nayeshdaggula/tailify'
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Errorpanel from '../shared/Errorpanel';
import Image from 'next/image';
import { IconEye, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

function Recentnotifications({ closeNotificationsDrawer, reloadNotifications }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const user_id = userInfo?.user_id;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMeaaage, setErrorMeaaage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const take = 10;
    const router = useRouter();
    const getNotifications = async () => {
        setIsLoading(true);
        Notificationapi.get('/getnotifications', {
            params: {
                user_id: user_id,
                skip: skip,
                take: take
            }
        })
            .then((res) => {
                let data = res.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setIsLoading(false);
                    setErrorMeaaage(finalresponse);
                    return false;
                }
                const newNotifications = data.notifications;
                if (newNotifications?.length < take) {
                    setHasMore(false);
                }
                setNotifications([...notifications, ...newNotifications]);
                setSkip(skip + take);
                setIsLoading(false);
                return false;
            })
            .catch((error) => {
                console.log(error);
                let finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setIsLoading(false);
                setErrorMeaaage(finalresponse);
                return false;
            })
    }

    useEffect(() => {
        getNotifications();
    }, [])

    const loadMoreNotifications = () => {
        getNotifications();
    }

    const onNotificationClick = (link) => {
        if (link) {
            const url = new URL(link);
            router.push(url.pathname);
        }
    }

    return (
        <>
            <Card className="w-full p-0 relative" padding='0px'>
                <Card.Section className='fixed w-full flex justify-between items-center'>
                    <p className="text-[18px] font-semibold">Recent Notifications</p>
                    <button onClick={closeNotificationsDrawer} className='cursor-pointer p-0 text-[#2B2B2B] bg-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#2B2B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </Card.Section>
                <Card.Section className='p-0 top-[50px] fixed w-full'>
                    <div className='flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh-80px)]'>
                        {notifications?.length > 0 ?
                            notifications.map((notification, index) => (
                                <div className="w-full mb-3" key={index}>
                                    <div className="flex flex-row items-center gap-1">
                                        <div className={`flex flex-col bg-[#eff5ff] border border-[#e1e1e1] w-full px-3 py-2 rounded-md gap-2`}>
                                            <div className='flex flex-row justify-between'>
                                                <p className="text-[14px] w-full text-start">{notification.message}</p>
                                                <div className='cursor-pointer' onClick={() => onNotificationClick(notification?.link)}>
                                                    <IconEye size={18} />
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-between items-center'>
                                                <div className='flex flex-row items-center gap-2'>
                                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-amber-200 overflow-hidden">
                                                        {
                                                            notification.added_user_profile ? (
                                                                <Image
                                                                    width={75}
                                                                    height={75}
                                                                    src={notification.added_user_profile}
                                                                    alt="Profile"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <IconUser width={"100%"} height={"100%"} className="p-1" />
                                                            )}
                                                    </div>
                                                    <Link href={userInfo?.uuid !== notification?.added_by_user_uid ? `/userprofile/${notification?.added_by_user_uid}` : `/myaccount/profile`}>
                                                        <p className="text-[14px] font-semibold">{notification?.added_user_name}</p>
                                                    </Link>
                                                </div>
                                                <p className="text-[12px] text-[#2B2B2B] font-medium">{dayjs(notification.created_at).format('DD-MM-YYYY hh:mm A')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <div className='flex justify-center items-center h-full'>
                                <p className='text-[14px] text-[#2B2B2B]'>No Notifications Found</p>
                            </div>
                        }
                        {(hasMore && notifications.length > 0) &&
                            <button onClick={loadMoreNotifications} className="flex items-center text-center py-1 px-2 text-[#044093] rounded w-full justify-center my-1 text-[14px] cursor-pointer font-semibold">
                                Load More
                            </button>
                        }
                    </div>
                </Card.Section>
            </Card>
            {
                errorMeaaage !== '' &&
                <Errorpanel
                    errorMessages={errorMeaaage}
                />
            }
        </>
    )
}

export default Recentnotifications