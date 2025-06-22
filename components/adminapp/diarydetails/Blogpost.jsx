import Diariesapi from '@/components/api/Diariesapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { Button, Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'

function Blogpost({ diaryContent, totalPages, uid, isLoadingEffect, setIsLoadingEffect, updateDiarypageno }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [content, setContent] = useState(diaryContent ?? '');

    const getDiaryPages = (diaryUid, pageParam) => {
        setIsLoadingEffect(true);
        Diariesapi.get('getadmindiarypages', {
            params: {
                diary_uid: diaryUid,
                page_no: pageParam
            }
        }).then((res) => {
            const data = res.data;
            if (data.status === 'success') {
                setContent(data.content);
                setErrorMessage('');
                setIsLoadingEffect(false);
                return false;
            } else {
                const finalresponse = {
                    message: data.message,
                    server_res: data
                };
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            }
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
        });
    };

    useEffect(() => {
        if (diaryContent) {
            setContent(diaryContent);
        }
    }, [diaryContent])

    return (
        <>
            <div className='relative'>
                <div className='flex justify-end py-8 px-2'>
                    <div className="flex justify-end items-center space-x-2">
                        <Button
                            variant='default'
                            className={`!p-1 !border-1 ${currentPage === 1 ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                            onClick={() => {
                                if (currentPage > 1) {
                                    const newPage = currentPage - 1;
                                    setCurrentPage(newPage);
                                    updateDiarypageno(newPage)
                                    getDiaryPages(uid, newPage); // Use unified API for both directions
                                }
                            }}
                        >
                            <IconChevronLeft color={currentPage === 1 ? '#2b2b2b99' : '#044093'} className={`${currentPage === 1 ? 'cursor-not-allowed ' : 'cursor-pointer'} h-5 w-fit`} />
                        </Button>
                        <div className="items-center justify-center p-1 text-md font-semibold w-fit h-fit  bg-[#fff] text-[#044093] rounded-sm">{currentPage}/{totalPages}</div>
                        <Button
                            variant='default'
                            className={`!p-1 !border-1 ${currentPage === totalPages ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    const newPage = currentPage + 1;
                                    setCurrentPage(newPage);
                                    updateDiarypageno(newPage)
                                    getDiaryPages(uid, newPage);
                                }
                            }}
                        >
                            <IconChevronRight color={currentPage === totalPages ? '#2b2b2b99' : '#044093'} className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit`} />
                        </Button>
                    </div>
                </div>
                <div className="px-6">
                    <div
                        className="h-full space-y-6 font-medium text-[#2B2B2B] text-justify text-[12px] leading-[24px] text-wrap"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: content }}

                    ></div>
                </div>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={true} overlayBg='' />
                    </div>
                }
            </div>
            <div className="flex justify-end items-center space-x-2 pb-6 px-2">
                <Button
                    variant='default'
                    className={`!p-1 !border-1 ${currentPage === 1 ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                    onClick={() => {
                        if (currentPage > 1) {
                            const newPage = currentPage - 1;
                            setCurrentPage(newPage);
                            updateDiarypageno(newPage)
                            getDiaryPages(uid, newPage);
                        }
                    }}
                >
                    <IconChevronLeft color={currentPage === 1 ? '#2b2b2b99' : '#044093'} className={`${currentPage === 1 ? 'cursor-not-allowed ' : 'cursor-pointer'} h-5 w-fit`} />
                </Button>
                <div className="items-center justify-center p-1 text-md font-semibold w-fit h-fit  bg-[#fff] text-[#044093] rounded-sm">{currentPage}/{totalPages}</div>
                <Button
                    variant='default'
                    className={`!p-1 !border-1 ${currentPage === totalPages ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                    onClick={() => {
                        if (currentPage < totalPages) {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            updateDiarypageno(newPage)
                            getDiaryPages(uid, newPage);
                        }
                    }}
                >
                    <IconChevronRight color={currentPage === totalPages ? '#2b2b2b99' : '#044093'} className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit`} />
                </Button>
            </div>
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </>
    );
}

export default Blogpost;
