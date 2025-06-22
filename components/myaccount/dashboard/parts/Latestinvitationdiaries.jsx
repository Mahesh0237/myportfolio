import TableLoadingEffect from '@/components/shared/Tableloadingeffect'
import { Button } from '@nayeshdaggula/tailify'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

function Latestinvitationdiaries({ latestInvitationDiriesLoading, latestInvitationDiries }) {
    return (
        <React.Fragment>
            <div className='shadow-[0px_0px_3px_rgba(0,0,0,0.1)] bg-white rounded-[5px] p-2 mt-2'>
                <p className='text-[14px] 2xl:text-[16px] 4xl:text-[18px] font-semibold p-2'>Latest Invited Diries</p>
                <div className="w-full relative overflow-x-auto rounded-[4px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                            <tr>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                                        Diary Name
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                                        Author
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                                        Updated Date
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2 sticky_column_last">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                                        Action
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                latestInvitationDiriesLoading === false ?
                                    latestInvitationDiries.length > 0 ?
                                        latestInvitationDiries.map((diary, index) => (
                                            <tr key={index} className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                                                <td className="px-4 py-2 truncate">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[14px] 4xl:text-[16px] font-semibold leading-[18px]'>
                                                        {diary?.name || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[14px] 4xl:text-[16px] font-semibold leading-[18px]'>
                                                        {diary?.author_name || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2 truncate">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[14px] 4xl:text-[16px] font-semibold leading-[18px]'>
                                                        {dayjs(diary?.updated_at).format("DD MMM YYYY")}
                                                    </p>
                                                </td>
                                                <td className='text-center sticky_column_last'>
                                                    <Link href={`/diarydetails/${diary?.uuid}`} className='flex items-center justify-center'>
                                                        <Button variant='default' size='xs' color='#41b6e6' className='flex items-center justify-center gap-1.5'>
                                                            <IconEye size={14} className=' 4xl:size-5'/>
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={4} className='text-center py-4'>
                                                <p className='text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]'>
                                                    No data found
                                                </p>
                                            </td>
                                        </tr>
                                    :
                                    <TableLoadingEffect colspan={4} tr={4} />
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Latestinvitationdiaries