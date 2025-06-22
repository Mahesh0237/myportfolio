import { Button, Card, Loadingoverlay, Select } from '@nayeshdaggula/tailify';
import { IconShare, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import Errorpanel from '@/components/shared/Errorpanel';
import Diariesapi from '@/components/api/Diariesapi';
import { toast } from 'react-toastify';
import config from '@/config';

function Sharediarybylinkmodaltogroupmember({ closeSharediarybylinkmodaltoGroup, diary_id, diary_uid, user_uid, diary_name }) {
    const user_info = useUserDetails((state) => state.user_info);
    const access_token = useUserDetails((state) => state.access_token);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)
    const [genratedToken, setGenratedToken] = useState(null)
    const handleGenrateToken = () => {
        Diariesapi.post('/generatediarysharetokentogroupmember', {
            user_id: user_info?.user_id,
            diary_id: diary_id,
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
                toast.success('Token Genrated Successfully', {
                    position: "top-right",
                    autoClose: 3000,
                })
                setGenratedToken(data?.genrated_token || null)
                setIsLoadingEffect(false);
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this link!',
                // url: `${config.main_url}/diarydetails/${diary_uid}?diary_access_token=${genratedToken}&sender_uid=${user_uid}`,
                url: `${config.main_url}/myaccount/diary/${diary_name}?uid=${diary_uid}&diary_access_token=${genratedToken}&sender_uid=${user_uid}`,
            }).catch((error) => console.log('Sharing failed', error));
        } else {
            alert('Share not supported on this browser. Please copy the URL manually.');
        }
    };

    return (
        <div className='relative'>
            <Card padding='0' margin='0' className='w-[100%] max-sm:w-[100%] max-sm:rounded-none max-sm:!border-0 max-sm:shadow-none'>
                <Card.Section className='!px-4 !py-2'>
                    <div className="flex justify-between items-center">
                        <p className="text-[#044093] text-[16px] max-sm:text-[16px] md:text-xl 2xl:text-[32px]">Share diary by link</p>
                        <Button variant="default" onClick={closeSharediarybylinkmodaltoGroup} className='!px-0 focus:outline-none border-none '>
                            <IconX size={20} color='#044093' />
                        </Button>
                    </div>
                </Card.Section>
                <Card.Section className='!px-4 !border-b-1 '>
                    {
                        genratedToken !== null ?
                            <div className='flex flex-row justify-between items-center'>
                                <p className="text-[13px] max-sm:text-[13px] md:text-[14px] mt-2 2xl:text-[32px]">Token is genrated share this link to your friends</p>
                                <Button
                                    variant='default'
                                    onClick={handleShare}
                                    className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer">

                                    <IconShare className='h-3.5 w-6' />
                                    Share
                                </Button>
                                {/* <Button variant="default" onClick={() => {
                                    navigator.clipboard.writeText(genratedToken);
                                    toast.success('Token Copied to Clipboard', {
                                        position: "top-right",
                                        autoClose: 3000,
                                    })
                                }} className='!px-0 focus:outline-none border-none '>
                                    <IconSearch size={20} color='#044093' />
                                </Button> */}
                            </div>
                            :
                            <p className="text-[13px] max-sm:text-[13px] md:text-[14px] mt-2 2xl:text-[32px]">Please genrate a token to share the link</p>

                    }
                    {/* <p className="text-[13px] max-sm:text-[13px] md:text-[14px] mt-2">Token: {genratedToken}</p>
                    <p className="text-[13px] max-sm:text-[13px] md:text-[14px] mt-2">You can share this token with your friends to access the diary.</p> */}
                </Card.Section>
                {
                    genratedToken === null &&
                    <Button
                        onClick={handleGenrateToken}
                        className="cursor-pointer !flex justify-end !px-4 !mx-4 my-2 !ml-auto !text-[13px] !bg-[#044093] !text-white !py-2 2xl:!text-[28px] 2xl:font-normal">
                        Generate Token
                    </Button>
                }
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

export default Sharediarybylinkmodaltogroupmember;
