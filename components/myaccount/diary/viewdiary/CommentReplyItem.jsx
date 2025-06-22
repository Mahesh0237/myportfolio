'use client'
import Image from "next/image";
import dayjs from "dayjs";
import { IconHeart, IconBrandLine, IconSend, IconHeartFilled, IconTrash } from "@tabler/icons-react";
import { Button, Textarea } from "@nayeshdaggula/tailify";
import { useEffect, useRef } from "react";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import maleavatar from "@/public/assets/male_avatar.jpg";
import femaleavatar from "@/public/assets/female_avatar.jpg";

function CommentReplyItem({ comment, handleReply, replyText, handleReplyTextChange, replyTextError, isLoading, handleSubmitReply, parentCommentId, setParentCommentId, handleSubmitLike, user_id, openDeleteDiaryCommentModal, diaryPageDetails, user_uid }) {

    const isLogged = useUserDetails((state) => state.isLogged);
    const replyBoxRef = useRef(null);
    useEffect(() => {
        function handleClickAnywhere(event) {
            if (replyBoxRef.current && !replyBoxRef.current.contains(event.target)) {
                setParentCommentId(null);
            }
        }

        if (parentCommentId !== null) {
            document.addEventListener("mousedown", handleClickAnywhere);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickAnywhere);
        };
    }, [parentCommentId]);

    return (
        <>
            <div className="ml-4 mt-4">
                <div key={comment.id} className="pl-3 flex-col items-center justify-between gap-2">
                    <div className="border-l flex items-start 2xl:items-center gap-2 pl-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                                width={24}
                                height={24}
                                src={
                                    comment?.user_image
                                        ? comment.user_image
                                        : comment?.user_gender === "Female"
                                            ? femaleavatar
                                            : maleavatar
                                }
                                alt="Profile Photo"
                                className=" object-cover w-full h-full"
                            />
                        </div>
                        <p className="font-semibold text-[14px] 2xl:text-[26px]">{comment.user_name}</p>
                        <p className="text-gray-400 text-xs ml-auto">
                            {dayjs(comment?.created_at).format("DD MMM YYYY")}
                        </p>
                    </div>
                    <p className="text-[12px] text-[#2b2b2b] mt-2 pl-2 2xl:text-[20px]">{comment.comment}</p>
                    {
                        isLogged &&
                        <div className="flex items-center gap-4 text-gray-500 text-sm pt-2 pl-2">
                            <div className='cursor-pointer flex items-center' onClick={() => handleSubmitLike(comment.id)}>
                                <div className='flex flex-row items-center gap-1'>
                                    {
                                        comment?.commentLikes?.length > 0 &&
                                            comment?.commentLikes?.filter((like) => like.user_id === user_id).length > 0 ? (
                                            <IconHeartFilled className='w-4 h-42xl:h-7 2xl:w-7' color='red' />
                                        ) : (
                                            <IconHeart className='w-4 h-4 2xl:h-7 2xl:w-7' />
                                        )
                                    }
                                    <p className='text-[12px] text-[#2b2b2b]'>{comment?.likeCount || 0} Likes</p>
                                </div>
                            </div>
                            <button
                                className="flex items-center cursor-pointer"
                                onClick={() => handleReply(comment.id)}
                            >
                                <IconBrandLine className="w-4 h-4 2xl:h-7 2xl:w-7" /> Reply
                            </button>
                            {
                                diaryPageDetails?.author_details?.author_uid === user_uid &&
                                <Button onClick={() => openDeleteDiaryCommentModal(comment.id)} variant="light" className="!p-1 flex items-center justify-center !text-[#fff] cursor-pointer !rounded-full !bg-[#B91C1C]">
                                    <IconTrash size={14} />
                                </Button>
                            }
                        </div>
                    }
                </div>
                {
                    parentCommentId === comment.id &&
                    <div className='w-full p-2 bg-white rounded-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border border-gray-200'>
                        <div ref={replyBoxRef} className='flex flex-row items-center gap-2'>
                            <div className='basis-[90%]'>
                                <Textarea
                                    placeholder="Reply..."
                                    className={`!border !rounded-[2px] text-[12px] !bg-[#fff] ${replyTextError ? "border-red-500" : "border-[#d1d5db]"}`}
                                    value={replyText}
                                    onChange={handleReplyTextChange}
                                    rows={2}
                                    textareaClassName='h-[40px] !bg-[#fff] 2xl:text-[20px]'
                                />
                            </div>
                            <div className='basis-[10%]'>
                                <button
                                    disabled={!replyText || isLoading}
                                    onClick={handleSubmitReply}
                                    className={`!text-white text-[12px] !px-2 !py-1 rounded ml-auto ${replyText ? "cursor-pointer bg-[#044093]" : "cursor-not-allowed bg-[rgba(4,64,147,0.75)]"}`}>
                                    <IconSend className='h-4 w-4 2xl:h-8 2xl:w-8' />
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {/* Recursive call for replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div>
                        {comment.replies.map((reply) => (
                            <CommentReplyItem
                                key={reply.id}
                                comment={reply}
                                handleReply={handleReply}
                                replyText={replyText}
                                handleReplyTextChange={handleReplyTextChange}
                                replyTextError={replyTextError}
                                isLoading={isLoading}
                                handleSubmitReply={handleSubmitReply}
                                parentCommentId={parentCommentId}
                                openDeleteDiaryCommentModal={openDeleteDiaryCommentModal}
                                diaryPageDetails={diaryPageDetails}
                                user_uid={user_uid}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentReplyItem;
