import Image from 'next/image'
import React from 'react'
import maleavatar from "@/public/assets/male_avatar.jpg";
import femaleavatar from "@/public/assets/female_avatar.jpg";
import dayjs from 'dayjs';
import CommentReplyItem from './CommentReplyItem';

function Comments({ allComments, commentsLoading, author_details }) {

    return (
        <div className="p-3">
            <div className="flex items-center justify-start gap-2 border-b border-[#d1d5db] pb-2">
                <Image
                    src={author_details?.profile_image || maleavatar}
                    alt="Profile Photo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <p>
                    {author_details?.name || "Author"}
                    <span className="block text-[10px] text-[#2b2b2b]/60">
                        Author
                    </span>
                </p>
            </div>

            {/* Comments List */}
            <div className="mt-2">
                <p className="text-[14px] text-[#2b2b2b] font-semibold mb-2">
                    {allComments.length} Comments
                </p>
                <div className='relative h-[calc(100vh-270px)] overflow-y-auto'>
                    <div className="space-y-6">
                        {
                            commentsLoading === false ? (
                                allComments.length !== 0 ?
                                    allComments.map((comment) => (
                                        <div key={comment.id} className="">
                                            <div className='flex items-center justify-between gap-2'>
                                                <Image
                                                    src={
                                                        comment?.user_image
                                                            ? comment.user_image
                                                            : comment?.user_gender === "Female"
                                                                ? femaleavatar
                                                                : maleavatar
                                                    }
                                                    alt="Profile Photo"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                                <p className="font-semibold text-[14px] text-[#000]">{comment?.user_name || 'N/A'}</p>
                                                <p className="text-gray-400 text-xs ml-auto">{dayjs(comment?.created_at).format('DD MMM YYYY')}</p>
                                            </div>
                                            <p className="text-[12px] text-[#2b2b2b] mt-2 pl-8">
                                                {comment?.comment}
                                            </p>
                                            {
                                                comment?.replies?.length > 0 && (
                                                    <div className="ml-4 mt-4">
                                                        {
                                                            comment?.replies?.map(comment => (
                                                                <CommentReplyItem
                                                                    key={comment.id}
                                                                    comment={comment}
                                                                />
                                                            ))}
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                    :
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 text-sm">No comments available.</p>
                                    </div>
                            )
                                : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 text-sm">Loading comments...</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comments
