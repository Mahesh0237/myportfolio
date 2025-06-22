'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Updatelogos from './Updatelogos';
import Image from 'next/image';
import { Loadingoverlay, Modal } from '@nayeshdaggula/tailify';
import Settingsapi from '@/components/api/Settingsapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';

function Logosettins() {
    const access_token = useEmployeDetails(state => state.access_token);
    // const permissions = useEmployeDetails((state) => state.permissions)

    const [themeUpdateModal, setThemeUpdateModal] = useState(false);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const openThemeUpdateModal = () => {
        setThemeUpdateModal(true)
    }
    const closeThemeUpdateModal = () => {
        setThemeUpdateModal(false)
    }

    const [themelogos, setThemelogos] = useState('');
    async function getLogoInfo() {
        Settingsapi.get('/getcompanylogos', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }
        )
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
                setThemelogos(data.logoUrls);
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

    useEffect(() => {
        setIsLoadingEffect(true)
        getLogoInfo();
    }, []);

    const reloadCompanylogosInfo = useCallback(() => {
        setIsLoadingEffect(true);
        getLogoInfo();
    }, []);

    return (
        <>
            <div className='border rounded-md my-6'>
                <div className="flex justify-between items-center align-middle mb-3 border-b px-3 py-4">
                    <p className="pl-1 text-[16px] font-bold">Theme Settings</p>
                    {/* {permissions?.settings_page?.includes("update_logos") && ( */}
                    <button onClick={openThemeUpdateModal} className="ml-[10px] flex justify-center items-center relative px-4 py-[8px] rounded bg-[#044093] cursor-pointer">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">Update Theme</p>
                    </button>
                    {/* )} */}
                </div>
                <div className="flex flex-col md:flex-row px-3 py-4 justify gap-x-40 relative">
                    <div className="flex flex-col mb-4 gap-y-1">
                        <p className="text-[14px] font-medium">Light Logo</p>
                        <div className='border p-5 rounded-lg'>
                            {themelogos?.light_logo ? (
                                <Image src={themelogos.light_logo} width={150} height={100} fit={"contain"} className="w-[150px] h-[100px] object-contain" alt="Light Logo" />
                            ) : (
                                <p className="text-[14px] font-normal">No Light Logo Available</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col mb-4 gap-y-1">
                        <p className="text-[14px] font-medium">Dark Logo</p>
                        <div className='border p-5 rounded-lg'>
                            {themelogos?.dark_logo ? (
                                <Image src={themelogos.dark_logo} width={150} height={100} fit={"contain"} className="w-[150px] h-[100px] object-contain" alt="Dark Logo" />
                            ) : (
                                <p className="text-[14px] font-normal">No Dark Logo Available</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col mb-4 gap-y-1">
                        <p className="text-[14px] font-medium">Favicon</p>
                        <div className='border p-5 rounded-lg'>
                            {themelogos?.favicon ? (
                                <Image src={themelogos.favicon} width={150} height={100} fit={"contain"} className="w-[150px] h-[100px] object-contain" alt="favicon" />
                            ) : (
                                <p className="text-[14px] font-normal">No Favicon Available</p>
                            )}
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

            {errorMessage &&
                <Errorpanel errorMessages={errorMessage} />
            }
            <Modal
                open={themeUpdateModal}
                onClose={closeThemeUpdateModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    themeUpdateModal &&
                    <Updatelogos
                        closeThemeUpdateModal={closeThemeUpdateModal}
                        refreshThemeLogos={reloadCompanylogosInfo}
                        themelogos={themelogos}
                    />
                }
            </Modal>
        </>
    )
}

export default Logosettins;