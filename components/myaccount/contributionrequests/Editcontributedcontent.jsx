'use client'
import Diariesapi from '@/components/api/Diariesapi'
import Errorpanel from '@/components/shared/Errorpanel'
import { useUserDetails } from '@/components/zustand/useUserDetails'
import { Button, Card, Loadingoverlay, Richtexteditor } from '@nayeshdaggula/tailify'
import { IconArrowBarToRight, IconX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function Editcontributedcontent({ closeEditDiarypage, pageid, diaryContent, refreshData }) {
    const [diaryContentChange, setDiaryContentChange] = useState(diaryContent ?? '');
    const [diaryContentError, setDiaryContentError] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const access_token = useUserDetails((state) => state.access_token);

    const [isBtnDisabled, setIsBtnDisabled] = useState(true);

    const onDiaryContentChange = (value) => {
        setDiaryContentError('');
        setDiaryContentChange(value)
    }

    const handleContenchange = () => {
        setIsLoadingEffect(true);
        if (diaryContentChange === '<p></p>') {
            setIsLoadingEffect(false);
            setDiaryContentError('Please Enter Content')
            return false
        }
        //want to hit an api to update the diary content
        Diariesapi.post('updatecontributioncontent', {
            pageid: pageid,
            diaryContentChange: diaryContentChange
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }).then((response) => {
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
            toast.success('Content updated successfully', {
                position: "top-right",
                autoClose: 1500,
                closeOnClick: true,
                progress: undefined,
            });
            closeEditDiarypage();
            refreshData();
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

    useEffect(() => {
        if (diaryContentChange !== diaryContent) {
            setIsBtnDisabled(false);
        } else {
            setIsBtnDisabled(true);
        }
    }, [diaryContentChange]);

    return (
        <>
            <Card padding='0' margin='0' className='w-[100%] !rounded-none relative'>
                <Card.Section className="fixed w-full h-[50px] flex justify-between items-center z-50 bg-white">
                    <p className="text-[#044093] font-bold text-xl md:text-[18px] text-[14px]">Edit diary page</p>
                    <IconArrowBarToRight className='cursor-pointer' size={25} onClick={closeEditDiarypage} />
                </Card.Section>
                <Card.Section className='!py-2 !px-2 md:!py-4 md:!px-6 top-[60px] fixed flex h-[calc(100vh-120px)] overflow-y-auto w-full'>
                    <Richtexteditor
                        value={diaryContent}
                        onChange={onDiaryContentChange}
                    />
                    {
                        diaryContentError !== '' &&
                        <p className='text-red-500 text-sm mt-2'>{diaryContentError}</p>
                    }
                </Card.Section>
                <Card.Section className='flex fixed bottom-0 flex-row items-center justify-end gap-6 w-full h-[50px]'>
                    <button onClick={handleContenchange} disabled={isBtnDisabled} className={`${isBtnDisabled ? "bg-[#040993]/50 cursor-not-allowed" : "bg-[#040993] cursor-pointer"} text-white px-4 py-1.5 rounded 2xl:text-[27px] 2xl:px-6 flex mb-2 justify-end ml-auto`}>Update</button>
                </Card.Section>
                {
                    errorMessage !== '' &&
                    <Errorpanel
                        errorMessages={errorMessage}
                    />
                }
            </Card>
            {
                isLoadingEffect &&
                <Loadingoverlay visible={isLoadingEffect} overlayBg='#2b2b2bcc' />
            }
        </>
    )
}
export default Editcontributedcontent;