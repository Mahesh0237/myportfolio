'use client'
import Diariesapi from '@/components/api/Diariesapi'
import Errorpanel from '@/components/shared/Errorpanel'
import { Richtexteditor } from '@/components/shared/richtexteditor/Richtexteditor'
import { useUserDetails } from '@/components/zustand/useUserDetails'
import { Button, Card, Loadingoverlay } from '@nayeshdaggula/tailify'
import { IconArrowBarToRight, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

function Editdiarypagecontent({ closeEditDiarypage, diaryuid, currentPage, diaryContent, refreshGetDiaryPages, diaryPageDetails, diary_access_status, user_uid }) {
    const [diaryContentChange, setDiaryContentChange] = useState('')
    const [diaryContentError, setDiaryContentError] = useState('')
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const access_token = useUserDetails((state) => state.access_token)
    // const [diaryAccessStatus, setDiaryAccessStatus] = useState(diary_access_status || "free");
    // const onDiaryAccessStatusChange = (value) => {
    //     setDiaryAccessStatus(value);
    // }

    const onDiaryContentChange = (value) => {
        setDiaryContentChange(value)
    }

    const handleContenchange = () => {
        setIsLoadingEffect(true);
        if (diaryContentChange === '') {
            setIsLoadingEffect(false);
            setDiaryContentError('Please enter diary content')
            return false
        }
        if (diaryContentChange === diaryContent) {
            setIsLoadingEffect(false);
            setDiaryContentError('Diary content already exists')
            return false
        }
        //want to hit an api to update the diary content
        Diariesapi.post('updatediarypagecontent', {
            diary_uid: diaryuid,
            diary_content: diaryContentChange,
            page_no: currentPage,
            useruid: user_uid
            // diaryAccessStatus: diaryAccessStatus
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((response) => {
                setIsLoadingEffect(false);
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success('Diary content updated successfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                closeEditDiarypage();
                refreshGetDiaryPages(diaryuid, currentPage);
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
                console.error('Error:', error);
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
        <Card padding='0' margin='0' className='w-[100%] !rounded-none relative'>
            <Card.Section className='!p-0 !py-4 !px-6'>
                <div className="flex justify-between items-center">
                    <p className="text-[#044093] font-bold text-xl md:text-[20px] max-sm:text-[17px]">Edit diary page</p>
                    <div onClick={closeEditDiarypage} className='cursor-pointer'>
                        <IconArrowBarToRight className='cursor-pointer' size={25} />
                    </div>
                </div>
            </Card.Section>
            <Card.Section className='!p-0 !py-4 !px-6'>
                {/* <div className="flex max-h-[65vh] overflow-y-auto">
                    <div className="w-full max-h-[65vh] overflow-y-auto"> */}
                <Richtexteditor
                    value={diaryContent}
                    onChange={onDiaryContentChange}
                />
                {/* </div>
                </div> */}
                {
                    diaryContentError !== '' &&
                    <p className='text-red-500 text-sm mt-2'>{diaryContentError}</p>
                }
                {/* {
                    diaryPageDetails?.diary_type === "Subscription" &&
                    <>
                        <p className="font-bold text-[14px] 2xl:text-[26px] 2xl:font-semibold">
                            Do you want to make this page visible as free or paid?
                        </p>
                        <div className="flex gap-x-3 2xl:text-[26px] 2xl:font-semibold">
                            <div className="flex gap-x-1">
                                <input
                                    type="radio"
                                    placeholder="Free"
                                    checked={diaryAccessStatus === "free"}
                                    onChange={() => onDiaryAccessStatusChange("free")}
                                    className="cursor-pointer"
                                />
                                <span>Free</span>
                            </div>
                            <div className="flex gap-x-1">
                                <input
                                    type="radio"
                                    placeholder="Paid"
                                    checked={diaryAccessStatus === "paid"}
                                    onChange={() => onDiaryAccessStatusChange("paid")}
                                    className="cursor-pointer"
                                />
                                <span>Paid</span>
                            </div>
                        </div>
                    </>
                } */}
                <div className='flex justify-end gap-2 py-2'>
                    <Button onClick={handleContenchange} className='bg-[#040993] text-white px-4 py-2 rounded 2xl:text-[27px] 2xl:px-6'>Update</Button>
                </div>
            </Card.Section>
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
        </Card>
    )
}
export default Editdiarypagecontent