'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Settingsapi from '@/components/api/Settingsapi';
import Updateinfomodal from './Updateinfomodal';
import { Loadingoverlay, Modal } from '@nayeshdaggula/tailify';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';

function Companygeneralinfo() {
    const access_token = useEmployeDetails(state => state.access_token);
    // const permissions = useEmployeDetails((state) => state.permissions)

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [companyInfo, setCompanyInfo] = useState([]);
    const [geralinfoModal, setGenralinfoModal] = useState(false)
    const openGenralinfoModal = () => {
        setGenralinfoModal(true);
    }
    const closeGenralinfoModal = () => {
        setGenralinfoModal(false);
    }

    async function getCompanyInfo() {
        setIsLoadingEffect(true);
        Settingsapi.get('getcompanyinfo', {
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
                setCompanyInfo(data.companyinfo);
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

    const reloadCompanydetailsInfo = useCallback(() => {
        getCompanyInfo();
    }, []);

    useEffect(() => {
        getCompanyInfo();
    }, []);

    return (
        <>
            <div className='border rounded-md py-4 mt-6'>
                <div className="flex justify-between items-center align-middle border-b px-3 pb-4">
                    <p className="pl-1 text-[16px] font-bold">Company Info</p>
                    {/* {permissions?.settings_page?.includes("update_company_info") && ( */}
                    <button onClick={openGenralinfoModal} className="ml-[10px] flex justify-center items-center relative px-4 py-[8px] cursor-pointer rounded bg-[#044093]">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">Update Info</p>
                    </button>
                    {/* )} */}
                </div>
                <div className='relative'>
                    <div className="px-3 pt-6 justify-between grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12">
                        <div className="flex flex-col mb-3 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">Company Name</p>
                            <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{companyInfo.name}</p>
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">Email</p>
                            {companyInfo.email === null || companyInfo.email === undefined || companyInfo.email === '' ?
                                <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>---</p>
                                :
                                <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{companyInfo.email}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-3 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">Phone Number</p>
                            {
                                companyInfo.phone === null || companyInfo.phone === undefined || companyInfo.phone === '' ?
                                    <p className="text-[14px] font-normal">----</p>
                                    :
                                    <p className="text-[14px] font-normal">{companyInfo?.phone_code ? companyInfo.phone_code : "+91"} {companyInfo.phone}</p>
                            }
                        </div>
                    </div>
                    <div className="justify-between px-3 py-4 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12">
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3 sm:col-span-6">
                            <p className="text-[14px] font-semibold">Address Line 1</p>
                            {companyInfo === null || companyInfo.address_line1 === null || companyInfo.address_line1 === '' || companyInfo.address_line1 === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{companyInfo.address_line1}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3 sm:col-span-6">
                            <p className="text-[14px] font-semibold">Address Line 2</p>
                            {companyInfo === null || companyInfo.address_line2 === null || companyInfo.address_line2 === '' || companyInfo.address_line2 === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal overflow-hidden pr-4" style={{ overflowWrap: "break-word" }}>{companyInfo.address_line2}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">City</p>
                            {companyInfo === null || companyInfo.city === null || companyInfo.city === '' || companyInfo.city === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal">{companyInfo.city}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">State</p>
                            {companyInfo === null || companyInfo.state === null || companyInfo.state === '' || companyInfo.state === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal">{companyInfo.state}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">Country</p>
                            {companyInfo === null || companyInfo.country === null || companyInfo.country === '' || companyInfo.country === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal">{companyInfo.country}</p>
                            }
                        </div>
                        <div className="flex flex-col mb-4 gap-y-1 col-span-3">
                            <p className="text-[14px] font-semibold">Pincode</p>
                            {companyInfo === null || companyInfo.zip_code === null || companyInfo.zip_code === '' || companyInfo.zip_code === undefined ?
                                <p className="text-[14px] font-normal">---</p>
                                :
                                <p className="text-[14px] font-normal">{companyInfo.zip_code}</p>
                            }
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
                open={geralinfoModal}
                onClose={geralinfoModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    geralinfoModal &&
                    <Updateinfomodal
                        closeGenralinfoModal={closeGenralinfoModal}
                        companyInfo={companyInfo}
                        reloadCompanydetailsInfo={reloadCompanydetailsInfo}
                    />
                }
            </Modal>
        </>
    )
}

export default Companygeneralinfo