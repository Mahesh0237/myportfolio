'use client'
import Settingsapi from '@/components/api/Settingsapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { Button, Card, Group, Loadingoverlay, Textinput } from '@nayeshdaggula/tailify';
import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandLinkedinFilled, IconBrandTwitterFilled, IconBrandYoutubeFilled, IconX } from '@tabler/icons-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

function Updatesocialmedialinks({ closeSocialMedialinkModal, socialMedialinkInfo, reloadSocialMedialinksInfo }) {
    const access_token = useEmployeDetails(state => state.access_token);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [facebookUrl, setFacebookUrl] = useState(socialMedialinkInfo?.facebook || '');
    const [facebookUrlError, setFacebookUrlError] = useState('');
    const updateFacebookUrl = (e) => {
        setFacebookUrl(e.target.value);
        setFacebookUrlError('');
    }

    const [instagramUrl, setInstagramUrl] = useState(socialMedialinkInfo?.instagram || '');
    const [instagramUrlError, setInstagramUrlError] = useState('');
    const updateInstagramUrl = (e) => {
        setInstagramUrl(e.target.value);
        setInstagramUrlError('');
    }

    const [linkedinUrl, setLinkedinUrl] = useState(socialMedialinkInfo?.linkedin || '');
    const [linkedinUrlError, setLinkedinUrlError] = useState('');
    const updateLinkedinUrl = (e) => {
        setLinkedinUrl(e.target.value);
        setLinkedinUrlError('');
    }

    const [twitterUrl, setTwitterUrl] = useState(socialMedialinkInfo?.twitter || '');
    const [twitterUrlError, setTwitterUrlError] = useState('');
    const updateTwitterUrl = (e) => {
        setTwitterUrl(e.target.value);
        setTwitterUrlError('');
    }

    const [youtubeUrl, setYoutubeUrl] = useState(socialMedialinkInfo?.youtube || '');
    const [youtubeUrlError, setYoutubeUrlError] = useState('');
    const updateYoutubeUrl = (e) => {
        setYoutubeUrl(e.target.value);
        setYoutubeUrlError('');
    }

    const updateSocialMediaLinks = async () => {
        setIsLoadingEffect(true);
        if (facebookUrl === '') {
            setFacebookUrlError('Please enter Facebook URL');
            setIsLoadingEffect(false);
            return false;
        }
        if (instagramUrl === '') {
            setInstagramUrlError('Please enter Instagram URL');
            setIsLoadingEffect(false);
            return false;
        }
        if (linkedinUrl === '') {
            setLinkedinUrlError('Please enter LinkedIn URL');
            setIsLoadingEffect(false);
            return false;
        }
        const data = {
            facebook: facebookUrl,
            instagram: instagramUrl,
            linkedin: linkedinUrl,
            twitter: twitterUrl,
            youtube: youtubeUrl
        }
        Settingsapi.post('updatesocialmedialinks', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse)
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data.message);
                reloadSocialMedialinksInfo();
                closeSocialMedialinkModal();
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
                console.log(error);
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
                setErrorMessage(finalresponse)
                setIsLoadingEffect(false);
            });
    }

    return (
        <>
            <Card withBorder={false} padding='0' className='relative'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-2'>
                        <p className="font-semibold text-[18px]">Update Social Media Links</p>
                        <Button onClick={closeSocialMedialinkModal} color='#044093'>
                            <IconX size={16} />
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className='h-fit max-h-[80vh] overflow-auto !px-1 !py-2'>
                    <div className='mb-3 gap-4 grid grid-cols-2'>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <IconBrandFacebookFilled size={20} color="#3b5998" />
                            <div className='w-full'>
                                <Textinput
                                    placeholder='Enter Facebook URL'
                                    value={facebookUrl}
                                    onChange={updateFacebookUrl}
                                    error={facebookUrlError}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <IconBrandInstagramFilled size={25} color="#E1306C" />
                            <div className='w-full'>
                                <Textinput
                                    placeholder='Enter Instagram URL'
                                    value={instagramUrl}
                                    onChange={updateInstagramUrl}
                                    error={instagramUrlError}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <IconBrandLinkedinFilled size={20} color="#0077b5" />
                            <div className='w-full'>
                                <Textinput
                                    placeholder='Enter LinkedIn URL'
                                    value={linkedinUrl}
                                    onChange={updateLinkedinUrl}
                                    error={linkedinUrlError}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <IconBrandYoutubeFilled size={20} color='#ea4335' />
                            <div className='w-full'>
                                <Textinput
                                    placeholder='Enter Youtube URL'
                                    value={youtubeUrl}
                                    onChange={updateYoutubeUrl}
                                    error={youtubeUrlError}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <IconBrandTwitterFilled size={20} color='#03a4ed' />
                            <div className='w-full'>
                                <Textinput
                                    placeholder='Enter Twitter URL'
                                    value={twitterUrl}
                                    onChange={updateTwitterUrl}
                                    error={twitterUrlError}
                                />
                            </div>
                        </div>
                    </div>
                </Card.Section>
                <Card.Section padding='0' className='pt-3 items-center'>
                    <button onClick={updateSocialMediaLinks} disabled={isLoadingEffect} className="flex justify-end px-6 ml-auto text-[14px] bg-[#044093] text-white py-2 rounded cursor-pointer">Update</button>
                </Card.Section>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                }
            </Card>
            {errorMessage !== '' &&
                <Errorpanel errorMessages={errorMessage} />
            }
        </>
    )
}

export default Updatesocialmedialinks