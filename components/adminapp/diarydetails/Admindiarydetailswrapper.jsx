
'use client'
import { Button } from '@nayeshdaggula/tailify'
import { IconArrowLeft, IconShare, IconTrash } from '@tabler/icons-react'
import React, { useCallback, useEffect, useState } from 'react'
import Comments from './Comments'
import Diariesapi from '@/components/api/Diariesapi'
import config from '@/config'
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails'
import Blogpost from './Blogpost'
import Errorpanel from '@/components/shared/Errorpanel'
import { useRouter } from 'next/navigation'
import DeleteModal from '@/components/shared/DeleteModal'
import { toast } from 'react-toastify'

function Admindiarydetailswrapper({ diaryuid }) {
    const userInfo = useEmployeDetails(state => state.user_info);
    const access_token = useEmployeDetails(state => state.access_token);
    const user_id = userInfo?.user_id;
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [diaryPageDetails, setDiaryPageDetails] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const getSingleViewDairyData = (uidParam, pageParam = 1) => {
        setIsLoadingEffect(true);
        Diariesapi.get('getadminsingleviewdairydata', {
            params: {
                uid: uidParam,
                page_no: pageParam

            }
        }).then((res) => {
            const data = res.data;
            if (data.status === 'error') {
                const finalresponse = {
                    message: data.message,
                    server_res: data
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            }
            setErrorMessage('');
            setDiaryPageDetails(data.diaryPageDetails);
            setTotalPages(data.totaldiaryPagesCount);
            setIsLoadingEffect(false);
            return false;
        }).catch((error) => {
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

    useEffect(() => {
        getSingleViewDairyData(diaryuid);
    }, [diaryuid])

    const refreshSingleViewDairyData = () => {
        getSingleViewDairyData(diaryuid);
    }

    const [diaryPageno, setDiaryPageno] = useState(1)
    const updateDiarypageno = useCallback((pgno) => {
        setDiaryPageno(pgno)
    }, [])

    const [allComments, setAllComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    const getDairyComments = async (diaryid) => {
        Diariesapi.get('getadmindiarycomments', {
            params: {
                diary_id: diaryid,
                diarypage_no: diaryPageno
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                let data = res.data;
                if (data.status == 'error') {
                    const finalrresponse = {
                        message: data.message,
                        server_res: data
                    }
                    setErrorMessage(finalrresponse);
                    setCommentsLoading(false);
                    return false;
                }
                setCommentsLoading(false);
                setAllComments(data?.comments || []);
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
    }, [diaryPageDetails?.id, diaryPageno]);

    const refreshComments = () => {
        setCommentsLoading(true);
        getDairyComments(diaryPageDetails?.id)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this link!',
                url: `${config.main_url}/diarydetails/${diaryuid}`,
            }).catch((error) => console.log('Sharing failed', error));
        } else {
            alert('Share not supported on this browser. Please copy the URL manually.');
        }
    };

    const [diaryStatus, setDiaryStatus] = useState('');
    const [suspendModal, setSuspendModal] = useState(false);
    const openSuspendModal = (status) => {
        setSuspendModal(true);
        setDiaryStatus(status);
    }
    const closeSuspendModal = () => {
        setSuspendModal(false);
    }

    const handleSuspend = () => {
        setIsLoadingEffect(true);
        Diariesapi.post('suspendorunsuspenddiary', {
            diary_uid: diaryuid,
            status: diaryStatus
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    console.log(finalresponse);
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data.message);
                getSingleViewDairyData(diaryuid);
                setErrorMessage('');
                setIsLoadingEffect(false);
                setSuspendModal(false);
                return false
            })
            .catch((error) => {
                console.log(error.message)
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

    const [featuredStatus, setFeaturedStatus] = useState('');
    const [featuredModal, setFeaturedModal] = useState(false);
    const openFeaturedModal = (status) => {
        setFeaturedModal(true);
        setFeaturedStatus(status);
    }
    const closeFeaturedModal = () => {
        setFeaturedModal(false);
        setFeaturedStatus('');
    }

    const handleFeaturedDiary = () => {
        setIsLoadingEffect(true);
        Diariesapi.post('featuredorunfeatureddiary', {
            diary_uid: diaryuid,
            status: featuredStatus
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    console.log(finalresponse);
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data.message);
                getSingleViewDairyData(diaryuid);
                setErrorMessage('');
                setIsLoadingEffect(false);
                setFeaturedModal(false);
                setFeaturedStatus('');
                return false
            })
            .catch((error) => {
                console.log(error.message)
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

    const [deleteDiaryModal, setDeleteDiaryModal] = useState(false);
    const openDeleteDiaryModal = () => {
        setDeleteDiaryModal(true);
    }
    const closeDeleteDiaryModal = () => {
        setDeleteDiaryModal(false);
    }

    const handleDeleteDiary = () => {
        setIsLoadingEffect(true);
        Diariesapi.post('admindeletediary', {
            diary_uid: diaryuid,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    console.log(finalresponse);
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data.message);
                setIsLoadingEffect(false);
                router.push('/admin/diaries');
                return false
            })
            .catch((error) => {
                console.log(error.message)
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
            <div className='flex items-start justify-between'>
                <div className='basis-[40%] flex flex-col gap-2'>
                    <h1 className="text-[20px] font-bold text-[#2b2b2b] leading-3 tracking-[0.5px]"
                        style={{ fontFamily: 'Times New Roman, serif' }}>
                        {diaryPageDetails?.name}
                    </h1>
                    <div className='flex flex-row gap-2 items-center'>
                        <p className="text-[#2b2b2b]/60 text-[12px]">
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
                            diaryPageDetails?.diary_status === 'Inactive' ?
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
                                        <circle cx="4.42871" cy={4} r={3} fill="#EC0606" />
                                    </svg>
                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                                        Inactive
                                    </p>
                                </div>
                                : diaryPageDetails?.diary_status === 'Active' ?
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
                                            <circle cx="4.42871" cy={4} r={3} fill="#14BA6D" />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">Active</p>
                                    </div>
                                    : diaryPageDetails?.diary_status === 'Suspended' &&
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
                                            <circle cx="4.42871" cy={4} r={3} fill="#434343" />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                            Suspended
                                        </p>
                                    </div>
                        }
                        {
                            diaryPageDetails?.is_featured_diary === 'Unfeatured' ?
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
                                        <circle cx="4.42871" cy={4} r={3} fill="#6B7280" />
                                    </svg>
                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#6B7280]">
                                        Unfeatured
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
                                        <circle cx="4.42871" cy={4} r={3} fill="#C2410C" />
                                    </svg>
                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#C2410C]">Featured</p>
                                </div>
                        }

                    </div>
                </div>
                <div className='basis-[60%] flex gap-2 justify-end'>
                    {
                        diaryPageDetails?.is_featured_diary === 'Featured' ?
                            <Button onClick={() => openFeaturedModal("Unfeatured")} variant='default' className="flex items-center !rounded-[4px] justify-center text-[12px] !text-[#fff] !bg-[#6B7280] cursor-pointer">
                                Make it Unfeatured
                            </Button>
                            :
                            <Button onClick={() => openFeaturedModal("Featured")} variant='default' className="flex items-center !rounded-[4px] justify-center text-[12px] !text-[#fff] !bg-[#044093] cursor-pointer">
                                Make it Featured
                            </Button>
                    }
                    {
                        diaryPageDetails?.diary_status === 'Suspended' ?
                            <Button
                                onClick={() => openSuspendModal('Active')}
                                className="flex items-center justify-center text-[12px] cursor-pointer !rounded-[6px] !bg-[#16A34A]">
                                UnSuspend Diary
                            </Button>
                            :
                            <Button
                                onClick={() => openSuspendModal('Suspended')}
                                className="flex items-center justify-center text-[12px] cursor-pointer !rounded-[6px] !bg-[#7f0000]">
                                Suspend Diary
                            </Button>
                    }
                    <Button
                        variant='light'
                        onClick={openDeleteDiaryModal}
                        className="flex items-center justify-center text-[12px] !text-[#fff] cursor-pointer !rounded-[6px] !bg-[#B91C1C]">
                        <IconTrash className='h-3.5 w-6' />
                        Delete diary
                    </Button>
                    <Button
                        variant='default'
                        onClick={handleShare}
                        className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer !rounded-[2px]">
                        <IconShare className='h-3.5 w-6' />
                        Share
                    </Button>
                    <Button onClick={() => { router.push('/admin/diaries') }} variant='default' className="flex items-center !rounded-[2px] justify-center text-[12px] !text-[#044093] hover:!text-[#fff] !border-1 !border-[#044093] hover:!bg-[#044093] cursor-pointer">
                        <IconArrowLeft className='h-4 w-6' /> Back
                    </Button>
                </div>
            </div>
            <div className='flex flex-row gap-2 w-full mt-2'>
                <div className='basis-[65%] bg-[#fff]'>
                    <div className='relative h-[calc(100vh-160px)] overflow-y-auto'>
                        <Blogpost
                            isLoadingEffect={isLoadingEffect}
                            setIsLoadingEffect={setIsLoadingEffect}
                            diary_id={diaryPageDetails?.id}
                            diaryContent={diaryPageDetails?.content}
                            totalPages={totalPages}
                            uid={diaryuid}
                            getSingleViewDairyData={getSingleViewDairyData}
                            refreshSingleViewDairyData={refreshSingleViewDairyData}
                            updateDiarypageno={updateDiarypageno}
                        />
                    </div>
                </div>
                <div className='basis-[35%] bg-[#fff]'>
                    <div className='relative h-[calc(100vh-160px)] overflow-y-auto'>
                        <Comments
                            diary_id={diaryPageDetails?.id}
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
            <DeleteModal
                title={`${diaryStatus === 'Suspended' ? 'Suspend Diary' : 'UnSuspend Diary'}`}
                message={`Are you sure you want to ${diaryStatus === 'Suspended' ? 'suspend' : 'unsuspend'} this diary?`}
                DeleteText={`${diaryStatus === 'Suspended' ? 'Suspend' : 'UnSuspend'}`}
                open={suspendModal}
                onClose={closeSuspendModal}
                onConfirm={handleSuspend}
            />

            <DeleteModal
                title={`${featuredStatus === 'Featured' ? 'Featured Diary' : 'Unfeatured Diary'}`}
                message={`Are you sure you want to make this diary as ${featuredStatus === 'Featured' ? 'Featured' : 'Unfeatured'} ?`}
                DeleteText="Yes"
                open={featuredModal}
                onClose={closeFeaturedModal}
                onConfirm={handleFeaturedDiary}
            />
            <DeleteModal
                title="Delete Diary"
                message="Are you sure you want to delete this diary?"
                open={deleteDiaryModal}
                onClose={closeDeleteDiaryModal}
                onConfirm={handleDeleteDiary}
            />
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </>
    )
}

export default Admindiarydetailswrapper