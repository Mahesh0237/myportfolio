'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Settingsapi from '@/components/api/Settingsapi';
import Updateinfomodal from './Updateinfomodal';
import { Loadingoverlay, Modal } from '@nayeshdaggula/tailify';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandLinkedinFilled, IconBrandTwitterFilled, IconBrandYoutubeFilled } from '@tabler/icons-react';
import Updatesocialmedialinks from './Updatesocialmedialinks';

function Soacialmedialogoswrapper() {
    const access_token = useEmployeDetails(state => state.access_token);
    // const permissions = useEmployeDetails((state) => state.permissions)

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [socialMedialinkInfo, setSocialMedialinkInfo] = useState({});
    const [socialMedialinkModal, setSocialMedialinkModal] = useState(false)
    const opnSocialMedialinkModal = () => {
        setSocialMedialinkModal(true);
    }
    const closeSocialMedialinkModal = () => {
        setSocialMedialinkModal(false);
    }

    async function getSocialMedialinks() {
        setIsLoadingEffect(true);
        Settingsapi.get('getsocialmedialinks', {
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
                setSocialMedialinkInfo(data?.socialmedialinks || {});
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
                return false;
            });
    }

    const reloadSocialMedialinksInfo = useCallback(() => {
        getSocialMedialinks();
    }, []);

    useEffect(() => {
        getSocialMedialinks();
    }, []);

    return (
        <>
            <div className='border rounded-md py-4 mt-6'>
                <div className="flex justify-between items-center align-middle border-b px-3 pb-4">
                    <p className="pl-1 text-[16px] font-bold">Social Media</p>
                    {/* {permissions?.settings_page?.includes("update_company_info") && ( */}
                    <button onClick={opnSocialMedialinkModal} className="ml-[10px] flex justify-center items-center relative px-4 py-[8px] cursor-pointer rounded bg-[#044093]">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">Update Info</p>
                    </button>
                    {/* )} */}
                </div>
                <div className='relative'>
                    <div className="px-3 pt-6 justify-between grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12">
                        <div className="flex flex-col mb-3 gap-y-1 col-span-4">
                            <div className='flex flex-row items-center gap-x-2'>
                                <IconBrandFacebookFilled size={20} color="#3b5998" />
                                <p className="text-[14px] font-semibold">Facebook</p>
                            </div>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{socialMedialinkInfo?.facebook || "------"}</p>
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-4">
                            <div className='flex flex-row items-center gap-x-2'>
                                <IconBrandInstagramFilled size={20} color="#E1306C" />
                                <p className="text-[14px] font-semibold">Instagram</p>
                            </div>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{socialMedialinkInfo?.instagram || "------"}</p>
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-4">
                            <div className='flex flex-row items-center gap-x-2'>
                                <IconBrandLinkedinFilled size={20} color="#0077b5" />
                                <p className="text-[14px] font-semibold">LinkedIn</p>
                            </div>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{socialMedialinkInfo?.linkedin || "------"}</p>
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-4">
                            <div className='flex flex-row items-center gap-x-2'>
                                <IconBrandYoutubeFilled size={20} color='#ea4335' />
                                <p className="text-[14px] font-semibold">Youtube</p>
                            </div>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{socialMedialinkInfo?.youtube || "------"}</p>
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-4">
                            <div className='flex flex-row items-center gap-x-2'>
                                <IconBrandTwitterFilled size={20} color='#03a4ed' />
                                <p className="text-[14px] font-semibold">Twitter</p>
                            </div>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{socialMedialinkInfo?.twitter || "------"}</p>
                        </div>
                    </div>
                    {
                        isLoadingEffect &&
                        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                        </div>
                    }

                </div>
            </div>
            {
                errorMessage !== '' &&
                <Errorpanel errorMessages={errorMessage} />
            }

            <Modal
                open={socialMedialinkModal}
                onClose={socialMedialinkModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    socialMedialinkModal &&
                    <Updatesocialmedialinks
                        closeSocialMedialinkModal={closeSocialMedialinkModal}
                        socialMedialinkInfo={socialMedialinkInfo}
                        reloadSocialMedialinksInfo={reloadSocialMedialinksInfo}
                    />
                }
            </Modal>
        </>
    )
}

export default Soacialmedialogoswrapper