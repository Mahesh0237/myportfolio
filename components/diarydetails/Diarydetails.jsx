'use client'
import React, { useEffect, useState } from 'react'
import Diariesapi from '@/components/api/Diariesapi'
import { useUserDetails } from '@/components/zustand/useUserDetails'
import Diarycontent from './parts/Diarycontent'
import Commentsview from './parts/Commentsview'
import Errorpanel from '../shared/Errorpanel'
import { Button, Drawer, Loadingoverlay } from '@nayeshdaggula/tailify'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { IconNotebook, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import DeleteModal from '../shared/DeleteModal'
import Addnewpagecontent from '../myaccount/diary/viewdiary/Addnewpagecontent'
import config from '@/config'

function Diarydetails({ diaryuid, user_uid, is_logged, diarypageno, diary_details, totaldiaryPagesCount, diaryacestokn, senderUid, access_denied, unregisteredusertoken }) {
    const userInfo = useUserDetails(state => state.user_info);
    const isLogged = useUserDetails(state => state.isLogged)
    const access_token = useUserDetails(state => state.access_token);
    const user_id = userInfo?.user_id || null;
    const [errorMessage, setErrorMessage] = useState('');
    const [diaryPageDetails, setDiaryPageDetails] = useState(diary_details || {});
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [totalPages, setTotalPages] = useState(totaldiaryPagesCount || 0);
    const [contributedBy, setContributedBy] = useState(diary_details?.added_by || '');

    const router = useRouter();
    const params = useSearchParams();
    let diary_access_token;
    if (diaryacestokn) {
        diary_access_token = diaryacestokn;
    } else {
        diary_access_token = params.get('diary_access_token');
    }

    let sender_uid;
    if (senderUid) {
        sender_uid = senderUid;
    } else {
        sender_uid = params.get('sender_uid');
    }
    // const diary_access_token = params.get('diary_access_token');
    // const sender_uid = params.get('sender_uid');

    const [diaryAccessDenied, setDiaryAccessDenied] = useState(access_denied || null);
    const getSingleViewDairyData = (diaryuid, useruid, diaryaccesstoken, senderuid, dirypgeno) => {
        setIsLoadingEffect(true);
        Diariesapi.get('getsingledairydata', {
            params: {
                uid: diaryuid,
                user_uid: useruid,
                diary_access_token: diaryaccesstoken,
                senderUid: senderuid,
                page_no: dirypgeno || 1
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                } else if (data.status === 'access_denied') {
                    setDiaryAccessDenied(data);
                    setIsLoadingEffect(false);
                }
                setErrorMessage('');
                setDiaryPageDetails(data?.diaryPageDetails || '');
                console.log(data?.diaryPageDetails?.added_by, "data?.diaryPageDetails?.added_by")
                setContributedBy(data?.diaryPageDetails?.added_by || '');
                setTotalPages(data?.totaldiaryPagesCount || 0);
                setIsLoadingEffect(false);
                return false;
            }).catch((error) => {
                const finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }
    // useEffect(() => {
    //     getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
    // }, [diaryuid, user_uid, diary_access_token, sender_uid, diarypageno]);

    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [allComments, setAllComments] = useState([])
    const [commentCount, setCommentCount] = useState(0)
    const [commentsLoading, setCommentsLoading] = useState(false);
    const getDairyComments = (diryid) => {
        Diariesapi.get('getdiarycomments', {
            params: {
                diary_id: diryid,
                diarypage_no: diarypageno
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    const finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse)
                    setCommentsLoading(false)
                    return false;
                }
                setCommentsLoading(false);
                setAllComments(data?.comments || [])
                setCommentCount(data?.commentCount || 0)
                return false;
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
                setCommentsLoading(false);
                return false;
            })
    }

    useEffect(() => {
        if (diaryPageDetails?.id) {
            getDairyComments(diaryPageDetails?.id)
        }
    }, [diaryuid]);

    const refreshComments = () => {
        setCommentsLoading(true);
        getDairyComments(diaryPageDetails?.id)
    }

    const [isAcceptRejectLoading, setIsAcceptRejectLoading] = useState(false);
    const handleAcceptRejectInvitation = (stus) => {
        Diariesapi.post('acceptrejectdiaryinvitation', {
            diary_uid: diaryuid,
            sender_uid: sender_uid,
            receiver_uid: user_uid,
            status: stus
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        }
        )
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsAcceptRejectLoading(false);
                    return false;
                }
                setIsAcceptRejectLoading(false);
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                if (data.inviationStatus === 'Accepted') {
                    getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
                    setDiaryAccessDenied(null);
                    router.push(`/diarydetails/${diaryuid}`);

                } else if (data.inviationStatus === 'Rejected') {
                    router.push('/myaccount/diary');
                }
                // remove the diary_access_token and diary_uid from session storage
                // sessionStorage.removeItem('diary_access_token');
                // sessionStorage.removeItem('diary_uid');
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
                setIsAcceptRejectLoading(false);
                return false;
            })
    }

    const handleLogin = () => {
        let redirectPath;
        if (diary_access_token) {
            redirectPath = `/diarydetails/${diaryuid}?diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        } else {
            redirectPath = `/diarydetails/${diaryuid}`
        }
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }

    const handleRegister = () => {
        // const redirectPath = `/diarydetails/${diaryuid}?diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        let redirectPath;
        if (diary_access_token) {
            redirectPath = `/diarydetails/${diaryuid}?diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        } else {
            redirectPath = `/diarydetails/${diaryuid}`
        }
        router.push(`/register?redirect=${encodeURIComponent(redirectPath)}`);
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this diary page!',
                url: `${window.location.origin}/diarydetails/${diaryuid}`,
            })
                .catch((error) => console.log('Sharing failed', error));
            handleShareCount(1)
        }
        else {
            alert(
                "Share not supported on this browser. Please copy the URL manually."
            );
        }
    }

    const [subscribeDiaryLoading, setIsSubscribeDiaryLoading] = useState(false);
    const [subscribeModal, setSubscribeModal] = useState(false);
    const openSubscribeModal = () => {
        if (is_logged === 'true') {
            setSubscribeModal(true);
        } else {
            toast.error('Please login to subscribe the diary.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }
    const closeSubscribeModal = () => {
        setSubscribeModal(false);
    }

    const handleDiarySubscribe = () => {
        Diariesapi.post('subscribediary', {
            diaryuid: diaryuid,
            useruid: user_uid,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        }
        )
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsSubscribeDiaryLoading(false);
                    return false;
                }
                setIsSubscribeDiaryLoading(false);
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
                setDiaryAccessDenied(null);
                closeSubscribeModal();
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
                setIsSubscribeDiaryLoading(false);
                return false;
            })
    }

    const handleFollowdiary = async (stus) => {
        if (!isLogged) {
            toast.error('Please login first')
            return false
        }
        await Diariesapi.post('followdiary', {
            diaryuid: diaryuid,
            useruid: user_uid,
            diary_stus: stus
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        }
        )
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    return false;
                }
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
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
                return false;
            })
    }

    const handleSubmitLikeDiary = () => {
        if (is_logged !== "true") {
            toast.error('Please login to like the diary')
            return;
        }
        setIsLoadingEffect(false);
        Diariesapi.post('likediary', {
            useruid: user_uid,
            diary_uid: diaryuid,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                // setTotalDiarylikes(data.diarylikedcounts);
                setIsLoadingEffect(false);
                getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
                return false;
            }).catch((error) => {
                const finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }

    const [isContribute, setIsContribute] = useState(false);
    const openContributeDrawer = () => {
        if (is_logged !== "true") {
            toast.error('Please login to like the diary')
            return;
        }
        setIsContribute(true);
    }
    const closeContributeDrawer = () => {
        setIsContribute(false);
    }

    const refreshPage = () => {
        window.location.reload();
    }
    const handleShareCount = async (pagno) => {
        await Diariesapi.post('/increasediarysharecount', {
            diary_uid: diaryuid,
            diarypage_no: pagno
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        }
        )
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    console.log('error', finalresponse)
                    return false;
                }
                getSingleViewDairyData(diaryuid, user_uid, diary_access_token, sender_uid, diarypageno);
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
                return false;
            })
    }

    // const storeSessionToken = async () => {
    //     const url = new URL(`${config.main_url}/cookiesapi/sessiontokencookies/`);
    //     const params = new URLSearchParams({
    //         unregistered_user_token: unregisteredusertoken,
    //     });

    //     url.search = params.toString();

    //     await fetch(url.toString(), {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .catch(error => {
    //             console.error('There was a problem with the fetch operation:', error);
    //             setIsLoading(false);
    //             return false;
    //         });
    // }

    // useEffect(() => {
    //     setTimeout(() => {
    //         storeSessionToken()
    //     }, 100)
    // }, [])

    return (
        <>
            {
                diaryAccessDenied !== null ?
                    <>
                        {
                            diaryAccessDenied?.error === 'access_denied' ?
                                <div className="flex flex-row justify-center items-center ">
                                    <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                        <h1 className='text-2xl font-bold text-red-500'>Access Denied</h1>
                                        <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>{diaryAccessDenied?.message}</p>
                                    </div>
                                </div>
                                :
                                diaryAccessDenied?.error === 'user_uid_is_required' ?
                                    <div className="flex flex-row justify-center items-center ">
                                        <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                            <h1 className='text-2xl font-bold text-red-500'>User Uid required</h1>
                                            <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>Please login or signup to access the diary.</p>
                                            {/* login and signup buttons */}
                                            <div className='flex flex-row gap-4 mt-4'>
                                                <Button className='!bg-[#044093] text-white px-4 py-2 rounded-md' onClick={handleLogin}>Login</Button>
                                                <Button className='bg-green-500 text-white px-4 py-2 rounded-md' onClick={handleRegister}>Sign Up</Button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    diaryAccessDenied?.error === 'user_not_found' ?
                                        <div className="flex flex-row justify-center items-center ">
                                            <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                                <h1 className='text-2xl font-bold text-red-500'>User Not Found</h1>
                                                <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>{diaryAccessDenied?.message}</p>
                                            </div>
                                        </div>
                                        :
                                        diaryAccessDenied?.error === 'invalid_token' ?
                                            <div className="flex flex-row justify-center items-center ">
                                                <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                                    <h1 className='text-2xl font-bold text-red-500'>Invalid Token</h1>
                                                    <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>{diaryAccessDenied?.message}</p>
                                                </div>
                                            </div>
                                            :
                                            diaryAccessDenied?.error === 'diary_invitation_pending' ?
                                                <>
                                                    {
                                                        is_logged === 'true' ?
                                                            <div className='relavtive'>
                                                                <div className="flex flex-row justify-center items-center ">
                                                                    <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                                                        <h3 className='text-lg font-bold '>Please accept the Diary invitation to see the diary content</h3>
                                                                        <div className='flex flex-row gap-4 mt-4'>
                                                                            <Button className='text-white px-4 py-2 rounded-md' onClick={() => handleAcceptRejectInvitation("Accepted")}>Accept</Button>
                                                                            <Button className='!bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => handleAcceptRejectInvitation("Rejected")} >Reject</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    isAcceptRejectLoading &&
                                                                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                                                                        <Loadingoverlay visible={isAcceptRejectLoading} overlayBg='' />
                                                                    </div>
                                                                }
                                                            </div>
                                                            :
                                                            <>
                                                                <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>Please login or signup to access the diary.</p>
                                                                {/* login and signup buttons */}
                                                                <div className='flex flex-row gap-4 mt-4'>
                                                                    <Button className='!bg-[#044093] text-white px-4 py-2 rounded-md' onClick={handleLogin}>Login</Button>
                                                                    <Button className='bg-green-500 text-white px-4 py-2 rounded-md' onClick={handleRegister}>Sign Up</Button>
                                                                </div>
                                                            </>
                                                    }
                                                </>
                                                :
                                                diaryAccessDenied?.error === 'diary_invitation_rejected' &&
                                                <div className="flex flex-row justify-center items-center ">
                                                    <div className='w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md'>
                                                        <h1 className='text-2xl font-bold text-red-500'>Access Denied invitation rejected</h1>
                                                        <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>{diaryAccessDenied?.message}</p>
                                                    </div>
                                                </div>

                        }
                    </>
                    :
                    <>
                        <div className={`flex flex-col md:flex-row items-start justify-between w-full  bg-[#f1f5f9] z-10 px-4 sm:px-6 md:px-8 lg:px-10 pt-6 ${scrollY > 120 ? 'top-[70px]' : ''}`}>
                            <div className='flex flex-col gap-1'>
                                <div className='flex flex-row items-center gap-2'>
                                    <h1 className="text-[20px] font-bold mb-[6px] text-[#2b2b2b] leading-6 tracking-[0.5px] 2xl:text-[34px]"
                                        style={{ fontFamily: 'Times New Roman, serif' }}>
                                        {diaryPageDetails?.name}
                                    </h1>
                                    {
                                        diaryPageDetails?.diary_type === "Group" ?
                                            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                <svg
                                                    width={9}
                                                    height={8}
                                                    viewBox="0 0 9 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                    preserveAspectRatio="xMidYMid meet"
                                                >
                                                    <circle cx="4.42871" cy={4} r={3} fill="#4CAF50" />
                                                </svg>
                                                <p className="flex-grow-0 flex-shrink-0 text-xs font-bold text-center text-[#4CAF50]">
                                                    {diaryPageDetails?.diary_type} diary ({diaryPageDetails?.status})
                                                </p>
                                            </div>
                                            :
                                            diaryPageDetails?.diary_type === "Subscription" ?
                                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                    <svg
                                                        width={9}
                                                        height={8}
                                                        viewBox="0 0 9 8"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                        preserveAspectRatio="xMidYMid meet"
                                                    >
                                                        <circle cx="4.42871" cy={4} r={3} fill="#673AB7" />
                                                    </svg>
                                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-bold text-center text-[#673AB7]">
                                                        {diaryPageDetails?.diary_type} diary
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                    <svg
                                                        width={9}
                                                        height={8}
                                                        viewBox="0 0 9 8"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                        preserveAspectRatio="xMidYMid meet"
                                                    >
                                                        <circle cx="4.42871" cy={4} r={3} fill="#FF9800" />
                                                    </svg>
                                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-bold text-center text-[#FF9800]">
                                                        {diaryPageDetails?.diary_type} diary ({diaryPageDetails?.status})
                                                    </p>
                                                </div>
                                    }
                                </div>
                                <div className='flex flex-row items-center gap-1'>
                                    <p className="text-[#2b2b2b]/60 text-[12px] 2xl:text-[22px]">
                                        {new Date(diaryPageDetails?.created_at).toLocaleString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                    {
                                        diaryPageDetails.is_followed_diary === "followed" &&
                                        <p className='text-[#2b2b2b]/60 text-[12px] 2xl:text-[22px]'>
                                            ( You are following this diary)
                                        </p>
                                    }
                                </div>
                            </div>
                            <div className='flex flex-row items-center gap-2 mt-4 md:mt-0'>
                                {
                                    (diaryPageDetails?.diary_type === "Individual" && diaryPageDetails?.status === "Public") &&
                                    diaryPageDetails?.author_details?.author_id !== user_id &&
                                    <Button
                                        onClick={openContributeDrawer}
                                        className="!bg-[#044093] flex !ml-auto items-center justify-center text-[12px] !text-[#fff] cursor-pointer 2xl:text-[24px] 2xl:px-5"
                                    >
                                        Contribute
                                    </Button>
                                }
                                <div onClick={handleSubmitLikeDiary} className={`flex items-center justify-center cursor-pointer gap-4 text-sm px-6 py-2 rounded-sm
                                    ${is_logged !== "true"
                                        ? 'bg-white border border-[#040993]'
                                        : diaryPageDetails.isuserlikeddiary
                                            ? 'bg-[#044093]'
                                            : 'bg-[#fff] border border-[#040993]'
                                    }`}
                                >
                                    <div className="flex flex-row items-center gap-1">
                                        {(is_logged !== "true" || !diaryPageDetails?.isuserlikeddiary) ? (
                                            <IconThumbUp className="w-4 h-4 text-[#040993] 2xl:w-7 2xl:h-7" />
                                        ) : (
                                            <IconThumbUpFilled className="w-4 h-4 text-amber-300 2xl:w-7 2xl:h-7" />
                                        )}
                                        <p className={`text-[12px] 2xl:text-[20px] 2xl:gap-1 ${is_logged !== "true" ? 'text-[#040993]' : (diaryPageDetails.isuserlikeddiary ? 'text-[#fff]' : 'text-[#040993]')}`}>
                                            {diaryPageDetails?.diarylikecount}
                                        </p>
                                    </div>
                                </div>
                                {
                                    diaryPageDetails?.author_details?.author_id !== user_id &&
                                    diaryPageDetails?.status === "Public" && (
                                        <>
                                            {
                                                diaryPageDetails.is_followed_diary === "followed" ?
                                                    <Button
                                                        onClick={() => handleFollowdiary('unfollowed')}
                                                        className="!bg-red-500 flex !ml-auto items-center justify-center text-[12px] !text-[#fff] cursor-pointer 2xl:text-[24px] 2xl:px-5"
                                                    >
                                                        Unfollow
                                                    </Button>
                                                    :
                                                    <Button
                                                        onClick={() => handleFollowdiary('followed')}
                                                        className="!bg-green-500 flex !ml-auto items-center justify-center text-[12px] !text-[#fff] cursor-pointer 2xl:text-[24px] 2xl:px-5"
                                                    >
                                                        Follow
                                                    </Button>
                                            }
                                        </>
                                    )
                                }
                                <Button
                                    variant="default"
                                    onClick={handleShare}
                                    className="!bg-[#fff] transform hover:scale-105 transition-transform duration-200 flex !ml-auto items-center justify-center text-[12px] !text-[#2b2b2b] !border-1 !border-[#2b2b2bcc] cursor-pointer 2xl:text-[24px] 2xl:px-5"
                                >
                                    <IconNotebook className="hidden md:flex h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                    Share
                                </Button>
                            </div>

                        </div>
                        <div className='relative'>
                            <div className="grid grid-cols-12 px-4 sm:px-6 md:px-8 lg:px-10 w-full bg-[#f1f5f9] py-6 gap-4 min-h-[calc(100vh-180px)] relative">
                                <div className=" col-span-12 md:col-span-8 bg-[#fff] flex flex-col justify-between">
                                    {
                                        diaryPageDetails?.diary_subscription_status === "diary_not_subscribed" ?
                                            <>
                                                <div className="flex flex-row justify-center items-center h-full my-[10px] mx-[5px]">
                                                    <div className='w-[100%] md:w-[80%] flex flex-col items-center justify-center h-[230px] bg-[#e6f0ff] rounded-md px-5'>
                                                        <h1 className='text-2xl font-bold text-red-500'>Access Denied..!!!</h1>
                                                        <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700] text-center'>You are not subscribed to this diary to access for the other pages to read, pls click the below button to subscribe the diary.</p>
                                                        <div className='flex flex-row gap-4 mt-4'>
                                                            <Button className='!bg-[#044093] text-white px-6 py-2 rounded-md' onClick={openSubscribeModal}>Subscribe</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                {/* {
                                                    diaryPageDetails?.content === "" || diaryPageDetails?.content === null || diaryPageDetails?.content === undefined ?
                                                        <div className="flex items-center justify-center h-full w-full leading-[24px]">
                                                            <p className="text-center text-[16px] font-semibold">No content available for this diary page.</p>
                                                        </div>
                                                        : */}
                                                        <Diarycontent
                                                            totalPages={totalPages}
                                                            uid={diaryuid}
                                                            currentPageno={diarypageno}
                                                            is_logged={is_logged}
                                                            user_uid={user_uid}
                                                            diaryPageDetails={diaryPageDetails}
                                                            diary_access_token={diary_access_token}
                                                            sender_uid={sender_uid}
                                                            getSingleViewDairyData={getSingleViewDairyData}
                                                            contributedBy={contributedBy}
                                                            handleShareCount={handleShareCount}
                                                        />
                                                {/* } */}
                                            </>

                                    }
                                </div>
                                {/* <div className="col-span-2 flex flex-col fixed h-full w-[32%] right-8">
                    <div className="overflow-y-auto bg-[#fff]"> */}
                                <div className="col-span-12 md:col-span-4 sticky top-[120px] h-[600px]"> {/* Fixed height */}
                                    <div className="overflow-y-auto bg-[#fff] h-full pr-4">
                                        <Commentsview
                                            diaryuid={diaryuid}
                                            diary_id={diaryPageDetails?.id}
                                            diarypageno={diarypageno}
                                            user_id={user_id}
                                            access_token={access_token}
                                            allComments={allComments}
                                            setAllComments={setAllComments}
                                            commentsLoading={commentsLoading}
                                            refreshComments={refreshComments}
                                            commentCount={commentCount}
                                            author_details={diaryPageDetails?.author_details}
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                isLoadingEffect &&
                                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                                </div>
                            }
                        </div>
                    </>
            }
            <DeleteModal
                open={subscribeModal}
                title="Are you sure you want to subscribe this diary?"
                message="You will be able to access all the pages of this diary after subscribing."
                onConfirm={handleDiarySubscribe}
                onCancel={closeSubscribeModal}
                onClose={closeSubscribeModal}
                DeleteText="Yes, Subscribe"
            />
            {
                errorMessage !== "" &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
            <Drawer
                size='XL'
                padding="5%"
                position="right"
                overlayProps={{ backgroundOpacity: 0.2 }}
                bg={"transparent"}
                zIndex={100}
                open={isContribute}
                withCloseButton={false}

            >
                {isContribute && (
                    <Addnewpagecontent
                        closeAddNewPageDrawer={closeContributeDrawer}
                        refreshSingleViewDairyData={refreshPage}
                        diary_id={diaryPageDetails.id}
                        totalPages={totaldiaryPagesCount}
                        user_uid={user_uid}
                        is_contributed={true}
                    />
                )}
            </Drawer>
        </>
    )
}

export default Diarydetails

