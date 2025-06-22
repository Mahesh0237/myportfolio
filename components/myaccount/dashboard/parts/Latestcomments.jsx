import { Button, Loadingoverlay } from '@nayeshdaggula/tailify'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

function Latestcomments({ latestCommentsLoading, latestComments }) {
    return (
        <>
            <h2 className='text-[14px] 2xl:text-[16px] font-semibold'>Latest Diary Comments</h2>
            <div className='bg-white rounded-lg shadow-sm p-2 relative'>
                <div className='flex flex-col gap-2'>
                    {
                        latestComments?.length !== 0 ?
                            latestComments?.map((comment, index) => (
                                <div key={index} className='flex flex-row justify-between items-center bg-[#f5f5f5] px-2 py-2 rounded-lg'>
                                    <div className='flex flex-col'>
                                        <h3 className='text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-semibold'>Diary Name: {comment?.diary_name}</h3>
                                        {/* <p className='text-[12px] text-[#9e9e9e]'>Date: {dayjs(comment?.created_at).format("DD MMM YYYY")}</p> */}
                                        <p className='text-[12px] 2xl:text-[13px] 4xl:text-[15px] text-[#9e9e9e]'>Comment: {comment?.comment}</p>
                                    </div>
                                    <Link href={`/myaccount/diary/${comment?.diary_name}?uid=${comment?.diary_uuid}`} >
                                        <IconEye className=' text-[12px] cursor-pointer' />
                                    </Link>
                                </div>
                            ))
                            :
                            <div className='flex flex-row justify-center items-center bg-[#f5f5f5] px-2 py-2 rounded-lg'>
                                <h3 className='text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-semibold'>No Invitations Found</h3>
                            </div>
                    }
                    {/* {
                        latestComments?.length >= 5 &&
                        <Button onClick={() => {
                            router.push('/admin/bookings')
                        }} className="w-full rounded !bg-[#00AEEF]">
                            View All
                        </Button>
                    } */}
                </div>
                {
                    latestCommentsLoading &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={latestCommentsLoading} overlayBg='' />
                    </div>
                }
            </div>
        </>
    )
}

export default Latestcomments