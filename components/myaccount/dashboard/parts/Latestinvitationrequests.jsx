import { Button, Loadingoverlay } from '@nayeshdaggula/tailify'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

function Latestinvitationrequests({ latestInvitationRequestsLoading, latestInvitationRequests }) {
    return (
        <>
            <h2 className='text-[14px] 2xl:text-[16px] font-semibold'>Latest Diary Invitaion Requests</h2>
            <div className='bg-white rounded-lg shadow-sm p-2 relative'>
                <div className='flex flex-col gap-2'>
                    {
                        latestInvitationRequests?.length !== 0 ?
                            latestInvitationRequests?.map((invitation, index) => (
                                <div key={index} className='flex flex-row justify-between items-center bg-[#f5f5f5] px-2 py-2 rounded-lg'>
                                    <div className='flex flex-col'>
                                        <h3 className='text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-semibold'>Diary Name: {invitation?.name}</h3>
                                        <p className='text-[12px] 2xl:text-[14px] 4xl:text-[16px] text-[#9e9e9e]'>Date: {dayjs(invitation?.created_at).format("DD MMM YYYY")}</p>
                                    </div>
                                    <div className='flex flex-col'>
                                        {
                                            invitation?.status === 'Rejected' ?
                                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                    <svg
                                                        width={9}
                                                        height={8}
                                                        viewBox="0 0 9 8"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                        preserveAspectRatio="xMidYMid meet"
                                                    >
                                                        <circle cx="4.42871" cy={4} r={3} fill="#EC0606" />
                                                    </svg>
                                                    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                                                        Rejected
                                                    </p>
                                                </div>
                                                : invitation?.status === 'Accepted' ?
                                                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                        <svg
                                                            width={9}
                                                            height={8}
                                                            viewBox="0 0 9 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                            preserveAspectRatio="xMidYMid meet"
                                                        >
                                                            <circle cx="4.42871" cy={4} r={3} fill="#14BA6D" />
                                                        </svg>
                                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">Accepted</p>
                                                    </div>
                                                    : invitation?.status === 'Pending' &&
                                                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fff] w-fit">
                                                        <svg
                                                            width={9}
                                                            height={8}
                                                            viewBox="0 0 9 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                                            preserveAspectRatio="xMidYMid meet"
                                                        >
                                                            <circle cx="4.42871" cy={4} r={3} fill="#434343" />
                                                        </svg>
                                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                                            Pending
                                                        </p>
                                                    </div>
                                        }
                                        <Link href={`/myaccount/invitations`}>
                                            <Button  size='xs' color='#044093' className='flex items-center justify-center gap-1.5 mt-2 w-full'>View</Button>
                                                {/* <IconEye size={14} /> */}
                                        </Link>
                                    </div>
                                </div>
                            ))
                            :
                            <div className='flex flex-row justify-center items-center bg-[#f5f5f5] px-2 py-2 rounded-lg'>
                                <h3 className='text-[12px] 2xl:text-[14px] 4xl:text-[16px]text-[14px] 2xl: font-semibold'>No Invitations Found</h3>
                            </div>
                    }
                    {/* {
                        latestInvitationRequests?.length >= 5 &&
                        <Button onClick={() => {
                            router.push('/admin/bookings')
                        }} className="w-full rounded !bg-[#00AEEF]">
                            View All
                        </Button>
                    } */}
                </div>
                {
                    latestInvitationRequestsLoading &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={latestInvitationRequestsLoading} overlayBg='' />
                    </div>
                }
            </div>
        </>
    )
}

export default Latestinvitationrequests