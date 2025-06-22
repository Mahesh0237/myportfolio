'use client'
import Image from "next/image";
import dayjs from "dayjs";
import maleavatar from "@/public/assets/male_avatar.jpg";
import femaleavatar from "@/public/assets/female_avatar.jpg";

function CommentReplyItem({ comment }) {
    return (
        <>
            <div className="ml-4 mt-4">
                <div key={comment.id} className="pl-3 flex-col items-center justify-between gap-2">
                    <div className="border-l flex items-start gap-2 pl-2">
                        <Image
                            // src={comment?.user_image || profilephoto}
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
                        <p className="font-semibold text-[14px]">{comment.user_name}</p>
                        <p className="text-gray-400 text-xs ml-auto">
                            {dayjs(comment?.created_at).format("DD MMM YYYY")}
                        </p>
                    </div>
                    <p className="text-[12px] text-[#2b2b2b] mt-2 pl-2">{comment.comment}</p>
                </div>

                {/* Recursive call for replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div>
                        {comment.replies.map((reply) => (
                            <CommentReplyItem
                                key={reply.id}
                                comment={reply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentReplyItem;
