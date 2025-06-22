'use client'
import Diariesapi from '@/components/api/Diariesapi';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import { Button, Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconCaretLeftFilled, IconCaretRightFilled, IconChevronLeft, IconChevronRight, IconEye, IconHeart, IconHeartFilled, IconShare, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'

function Diarycontent({ totalPages, uid, currentPageno, is_logged, user_uid, diaryPageDetails, getSingleViewDairyData, diary_access_token, sender_uid, contributedBy, handleShareCount }) {
    const user_info = useUserDetails((state) => state.user_info);
    const access_token = useUserDetails(state => state.access_token);
    const user_id = user_info?.user_id
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [currentPage, setCurrentPage] = useState(parseInt(currentPageno) || 1);
    // const [content, setContent] = useState(diaryPageDetails?.content ?? '');
    const router = useRouter();

    // const getDiaryPages = (diaryUid, pageParam) => {
    //     setIsLoadingEffect(true);
    //     Diariesapi.get('getdiarypages', {
    //         params: {
    //             diary_uid: diaryUid,
    //             page_no: pageParam
    //         }
    //     })
    //         .then((res) => {
    //             const data = res.data;
    //             if (data.status === 'success') {
    //                 setContent(data.content);
    //                 setErrorMessage(null);
    //                 setIsLoadingEffect(false);
    //                 return false;
    //             } else {
    //                 const finalresponse = {
    //                     status: 'error',
    //                     message: data.message
    //                 };
    //                 setErrorMessage(finalresponse);
    //                 setIsLoadingEffect(false);
    //                 return false;
    //             }
    //         })
    //         .catch((error) => {
    //             const finalresponse = {
    //                 status: 'error',
    //                 message: error.message
    //             };
    //             setErrorMessage(finalresponse);
    //             setIsLoadingEffect(false);
    //             return false;
    //         });
    // };

    // useEffect(() => {
    //     if (diaryPageDetails?.content) {
    //         setContent(diaryPageDetails?.content);
    //     }
    // }, [diaryPageDetails?.content])

    const handleShare = () => {
        if (navigator.share) {
            const shareUrl = currentPage === 1
                ? `${window.location.origin}/diarydetails/${uid}/${currentPage}`
                : window.location.href;

            navigator.share({
                title: 'Check out this link!',
                url: shareUrl,
            }).catch((error) => console.log('Sharing failed', error));
            handleShareCount(currentPage)
        } else {
            alert('Share not supported on this browser. Please copy the URL manually.');
        }
    };

    const handleSubmitLikeDiaryPage = () => {
        if (is_logged !== "true") {
            toast.error('Please login to like the diary')
            return;
        }
        setIsLoadingEffect(false);
        Diariesapi.post('likediarypage', {
            currentPageno: currentPageno,
            useruid: user_uid,
            diary_uid: uid,
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
                getSingleViewDairyData(uid, user_uid, diary_access_token, sender_uid, currentPageno)
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

    return (
        <>
            <div className='relative flex flex-col h-full'>
                <div className={`grid grid-cols-12 items-center bg-white px-6 py-3  ${contributedBy ? "py-10" : "py-3"} border border-gray-200`}>
                    {contributedBy && <p className="absolute top-2 left-6 text-[14px] font-semibold text-[#044093]">Contributed By: <span className='text-[#2b2b2b]'>{contributedBy}</span></p>}
                    <div className="order-3 md:order-1 col-span-12 lg:col-span-4 flex gap-2 items-center justify-center md:items-start md:justify-start mt-4 md:mt-0">
                        <div onClick={handleSubmitLikeDiaryPage} className={`flex items-center justify-center cursor-pointer gap-4 text-sm px-4 py-2 rounded-sm
    ${is_logged !== "true"
                                ? 'bg-white border border-[#040993]'
                                : diaryPageDetails.isuserlikedPage
                                    ? 'bg-[#044093]'
                                    : 'bg-[#fff] border border-[#040993]'
                            }`}
                        > <div className="flex flex-row items-center gap-1">
                                {(is_logged !== "true" || !diaryPageDetails?.isuserlikedPage) ? (
                                    <IconThumbUp className="w-4 h-4 text-[#040993] 2xl:w-7 2xl:h-7" />
                                ) : (
                                    <IconThumbUpFilled className="w-4 h-4 text-amber-300 2xl:w-7 2xl:h-7" />
                                )}
                                <p className={`text-[12px] 2xl:text-[20px] 2xl:gap-1 ${is_logged !== "true" ? 'text-[#040993]' : (diaryPageDetails.isuserlikedPage ? 'text-[#fff]' : 'text-[#040993]')}`}>
                                    {diaryPageDetails?.pagelikesCount}
                                </p>

                            </div>
                        </div>
                        <Button
                            variant='default'
                            className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[26px] !rounded-sm"
                            onClick={handleShare}
                        >
                            <IconShare className='h-3.5 w-6 2xl:h-6 2xl:w-11' />
                            {diaryPageDetails?.pagesharecount || 0}
                        </Button>
                        <div
                            className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] 2xl:text-[26px] !rounded-sm p-2"
                        >
                            <IconEye className='h-3.5 w-6 2xl:h-6 2xl:w-11' />
                            {diaryPageDetails?.pageviewscount || 0}
                        </div>
                    </div>
                    <div className="order-1 md:order-2 col-span-6 lg:col-span-4  flex items-start justify-start md:items-center md:justify-center">
                        <p className='font-serif'>Page: No. {currentPage}</p>
                    </div>
                    <div className="order-2 md:order-3 col-span-6 lg:col-span-4 flex justify-end items-center space-x-2">
                        <p className="flex items-center justify-center text-sm font-bold w-fit h-fit bg-[#fff] text-[#044093] rounded-sm font-sans">
                            {currentPage}/{totalPages}
                        </p>
                        <Button
                            variant='default'
                            className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === 1 ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                            onClick={() => {
                                if (currentPage > 1) {
                                    const newPage = currentPage - 1;
                                    setCurrentPage(newPage);
                                    router.push(`/diarydetails/${uid}/${newPage}`);
                                }
                            }}
                        >
                            <IconCaretLeftFilled
                                color={currentPage === 1 ? '#2b2b2b99' : '#044093'}
                                className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                            />
                        </Button>
                        <Button
                            variant='default'
                            className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === totalPages ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    const newPage = currentPage + 1;
                                    setCurrentPage(newPage);
                                    router.push(`/diarydetails/${uid}/${newPage}`);
                                }
                            }}
                        >
                            <IconCaretRightFilled
                                color={currentPage === totalPages ? '#2b2b2b99' : '#044093'}
                                className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                            />
                        </Button>
                    </div>
                </div>

                <div className=" px-6 mt-4 min-h-[400px]">
                    {
                        diaryPageDetails?.content === "" || diaryPageDetails?.content === null || diaryPageDetails?.content === undefined ?
                            <div className="flex items-center justify-center h-full w-full leading-[24px]">
                                <p className="text-center text-[16px] font-semibold">No content available for this diary page.</p>
                            </div>
                            :
                            <div
                                className="h-full space-y-6 font-medium text-[#2B2B2B] text-justify text-[12px] leading-[24px] text-wrap 2xl:text-[20px]"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                                dangerouslySetInnerHTML={{ __html: diaryPageDetails?.content }}

                            ></div>
                    }
                </div>
                <div className="mt-auto flex justify-end items-center space-x-2 p-6">
                    <div className="flex items-center justify-center p-1 text-sm font-semibold w-fit h-fit bg-[#fff] text-[#044093] rounded-sm">
                        <p className='text-sm font-[400] pr-1'>page.no:</p> {currentPage}/{totalPages}
                    </div>
                    <Button
                        variant='default'
                        className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === 1 ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                        onClick={() => {
                            if (currentPage > 1) {
                                const newPage = currentPage - 1;
                                setCurrentPage(newPage);
                                router.push(`/diarydetails/${uid}/${newPage}`);
                            }
                        }}
                    >
                        <IconCaretLeftFilled
                            color={currentPage === 1 ? '#2b2b2b99' : '#044093'}
                            className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                        />
                    </Button>
                    <Button
                        variant='default'
                        className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === totalPages ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                        onClick={() => {
                            if (currentPage < totalPages) {
                                const newPage = currentPage + 1;
                                setCurrentPage(newPage);
                                router.push(`/diarydetails/${uid}/${newPage}`);
                            }
                        }}
                    >
                        <IconCaretRightFilled
                            color={currentPage === totalPages ? '#2b2b2b99' : '#044093'}
                            className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                        />
                    </Button>
                </div>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={true} overlayBg='' />
                    </div>
                }
            </div>
        </>
    );
}

export default Diarycontent;
