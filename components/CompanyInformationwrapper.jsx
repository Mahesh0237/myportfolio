'use client'
import React, { useEffect } from 'react'
import Settingsapi from './api/Settingsapi';
import { useCompanyinfo } from './zustand/useCompanyinfo';

function CompanyInformationwrapper() {
    const updateCompanyInfo = useCompanyinfo((state) => state.updateCompanyInfo);
    async function getCompanyInfo() {
        Settingsapi.get('getallcompnayinfo', {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${access_token}`
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    console.log(finalResponse);
                    // setErrorMessage(finalResponse)
                    // setIsLoadingEffect(false);
                    return false;
                }
                updateCompanyInfo(data?.companyinfo || null);
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
                // setErrorMessage(finalresponse)
                return false;
            });
    }

    useEffect(() => {
        getCompanyInfo();
    }, [])

    return (
        <></>
    )
}

export default CompanyInformationwrapper