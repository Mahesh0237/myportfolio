'use client'
import React from 'react'
import { useCompanyinfo } from '../zustand/useCompanyinfo';

function Contactinformation() {
    const company_info = useCompanyinfo((state) => state.company_info);
    return (

        <div className="w-full h-full bg-gray-100 relative md:px-10 px-4 2xl:px-25">
            <div className="flex md:flex-row sm:flex-col flex-col justify-between items-start w-full h-full md:px-2 px-6 md:py-20 py-8">
                <div className="flex flex-col justify-start items-start md:w-[40%] gap-6">
                    <p className="text-[21px] md:text-[16px] text-black font-[500] 2xl:text-[26px]">
                        Contact Info
                    </p>
                    <p className=" md:text-[42px] text-[32px] text-[#044093] font-[600] leading-tight 2xl:text-[46px]">
                        We are always happy to assist you
                    </p>
                </div>
                <div className="flex justify-between items-start ">
                    <div className="flex flex-col md:space-y-4 space-y-2 md:px-8 md:py-8 px-4 py-4">
                        <p className=" w-fit md:text-[16px] text-[14px] font-semibold text-black 2xl:text-[36px]">Email Address</p>
                        <div className="flex flex-col space-y-2">
                            <p className="md:text-[16px] text-[12px] text-black 2xl:text-[26px]">{company_info?.email || "N/A"}</p>
                            {/* <p className="md:text-base text-[12px] text-gray-500 2xl:text-[24px]">
                                Assistance hours: Monday - Friday 6 am to 8 pm EST
                            </p> */}
                        </div>
                    </div>
                    <div className="flex flex-col md:space-y-4 space-y-2 md:pl-4 md:pr-3 px-4 py-4 md:py-8">
                        <p className=" w-fit md:text-[16px] text-[14px] font-semibold text-black 2xl:text-[36px]">Number</p>
                        <div className="flex space-y-2">
                            <p className="md:text-[16px] text-[12px] text-black 2xl:text-[26px]">{company_info?.phone_code || "+91"} {company_info?.phone || "N/A"}</p>
                            {/* <p className="md:text-base text-[12px] text-gray-500 2xl:text-[24px]">
                                Assistance hours: Monday - Friday 6 am to 8 pm EST
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Contactinformation