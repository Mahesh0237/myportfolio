import { IconBrandLine, IconHeart, IconHeartFilled, IconSend, IconTrash } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import profilephoto from '@/public/assets/author_1.svg'
import { Button, Textarea } from '@nayeshdaggula/tailify';
import Diariesapi from '@/components/api/Diariesapi';
import maleavatar from "@/public/assets/male_avatar.jpg";
import femaleavatar from "@/public/assets/female_avatar.jpg";
import Errorpanel from '@/components/shared/Errorpanel';
import dayjs from 'dayjs';
import CommentReplyItem from './CommentReplyItem';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import DeleteModal from '@/components/shared/DeleteModal';

// function addReplyToComment(comments, parentId, newReply) {
//     return comments.map(comment => {
//         if (comment.id === parentId) {
//             return {
//                 ...comment,
//                 replies: [...(comment.replies || []), newReply]
//             };
//         } else if (comment.replies) {
//             return {
//                 ...comment,
//                 replies: addReplyToComment(comment.replies, parentId, newReply)
//             };
//         } else {
//             return comment;
//         }
//     });
// }

function addReplyToComment(comments, parentId, newReply, depth = 0, maxDepth = 50) {
    // Safety check against circular references and excessive depth
    if (depth > maxDepth) {
        console.log('Maximum reply depth exceeded');
        return comments;
    }

    return comments.map(comment => {
        // Found the parent comment - add reply
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
            };
        }

        // Has replies - recursively process them
        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToComment(comment.replies, parentId, newReply, depth + 1, maxDepth)
            };
        }

        // No changes needed for this comment
        return comment;
    });
}

// function updateLikeInComments(comments, commentId, updatedComment) {
//     return comments.map(comment => {
//         if (comment.id === commentId) {
//             return {
//                 ...comment,
//                 likeCount: updatedComment.likeCount,
//                 commentLikes: updatedComment.commentLikes
//             };
//         } else if (comment.replies && comment.replies.length > 0) {
//             return {
//                 ...comment,
//                 replies: updateLikeInComments(comment.replies, commentId, updatedComment)
//             };
//         } else {
//             return comment;
//         }
//     });
// }

function updateLikeInComments(comments, commentId, updatedComment, depth = 0, maxDepth = 50) {
    // Safety check
    if (depth > maxDepth) {
        console.log('Maximum comment depth exceeded when updating likes');
        return comments;
    }

    return comments.map(comment => {
        // Found the comment to update
        if (comment.id === commentId) {
            return {
                ...comment,
                likeCount: updatedComment.likeCount,
                commentLikes: updatedComment.commentLikes
            };
        }

        // Process replies if they exist
        if (comment.replies?.length) {
            return {
                ...comment,
                replies: updateLikeInComments(comment.replies, commentId, updatedComment, depth + 1, maxDepth)
            };
        }

        // No changes needed
        return comment;
    });
}

function Comments({ user_id, access_token, allComments, commentsLoading, commentCount, setAllComments, diaryPageno, diaryPageDetails, user_uid }) {
    const isLogged = useUserDetails((state) => state.isLogged);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [commentTextError, setCommentTextError] = useState('')
    const handleCommentTextChange = (e) => {
        setCommentText(e.target.value)
        setCommentTextError('')
    }

    const submitComment = () => {
        setIsLoading(true)
        if (!commentText) {
            setCommentTextError('Please enter a comment')
            setIsLoading(false)
            return false;
        }

        Diariesapi.post('/postcommentondiary', {
            commentText: commentText,
            diary_id: diaryPageDetails?.id,
            user_id: user_id,
            diarypage_no: diaryPageno
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalresponse;
                    finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse)
                    setIsLoading(false)
                    return false;
                }
                setIsLoading(false);
                setCommentText('')
                // toast.success("Your comment has been posted successfully", {
                //     position: "top-right",
                //     autoClose: 2000,
                // })
                // refreshComments()
                setAllComments((prevComments) => {
                    return [data.comment, ...prevComments]
                });
                return false;
            })
            .catch((error) => {
                console.log('Error:', error);
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
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false
            })
    };

    const [replyText, setReplyText] = useState('')
    const [replyTextError, setReplyTextError] = useState('')
    const handleReplyTextChange = (e) => {
        setReplyText(e.target.value)
        setReplyTextError('')
    }

    const [modalSize, setModalSize] = useState("35%");
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setModalSize("90%");
            } else {
                setModalSize("35%");
            }
        };

        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [parentCommentId, setParentCommentId] = useState(null)
    const handleReply = (parentcmtid) => {
        setParentCommentId(parentcmtid)
    }

    const handleSubmitReply = () => {
        setIsLoading(true)
        if (!replyText) {
            setReplyTextError('Please enter a comment')
            setIsLoading(false)
            return false;
        }

        Diariesapi.post('/postreplycommentondiary', {
            commentText: replyText,
            diary_id: diaryPageDetails?.id,
            user_id: user_id,
            parent_comment_id: parentCommentId,
            diarypage_no: diaryPageno
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalresponse;
                    finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse)
                    setIsLoading(false)
                    return false;
                }
                setIsLoading(false);
                setReplyText('')
                setParentCommentId(null)
                setAllComments((prevComments) => {
                    return addReplyToComment(prevComments, parentCommentId, data.comment);
                });
                setParentCommentId(null)
                setReplyText('')
                return false;
            })
            .catch((error) => {
                console.log('Error:', error);
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
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false
            })
    }

    async function handleSubmitLike(commentId) {
        setIsLoading(true)
        Diariesapi.post('/likecomment', {
            comment_id: commentId,
            user_id: user_id,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalresponse;
                    finalresponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalresponse)
                    setIsLoading(false)
                    return false;
                }
                setIsLoading(false);
                // toast.success("Updated Successfully", {
                //     position: 'top-right',
                //     autoClose: 2000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // })
                // refreshComments()
                setAllComments((prevComments) => {
                    return updateLikeInComments(prevComments, commentId, data.comment);
                });
                return false;
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    }
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    }
                }
                setErrorMessage(finalresponse)
                setIsLoading(false)
                return false
            })
    }

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

    const [diaryCommentId, setDiaryCommentId] = useState(null)
    const [deleteDiaryCommentModal, setDeleteDiaryCommentModal] = useState(false);
    const openDeleteDiaryCommentModal = (commentid) => {
        setDiaryCommentId(commentid)
        setDeleteDiaryCommentModal(true);
    };
    const closeDeleteDiaryCommentModal = () => {
        setDeleteDiaryCommentModal(false);
    };

    const handleDeleteComment = async () => {
        await Diariesapi.post('/deletediarycomment', {
            diaryid: diaryPageDetails?.id,
            comment_id: diaryCommentId
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalresponse = {
                        message: data.message,
                        server_res: data
                    }
                    setErrorMessage(finalresponse)
                }
                closeDeleteDiaryCommentModal()
                // update setAllComments 
                // setAllComments(prevComments => {
                //     // Function to recursively filter out the deleted comment
                //     const filterDeletedComment = (comments) => {
                //         return comments.filter(comment => {
                //             // Keep the comment if it's not the deleted one
                //             if (comment.id !== diaryCommentId) {
                //                 // Recursively filter its replies
                //                 if (comment.replies && comment.replies.length > 0) {
                //                     comment.replies = filterDeletedComment(comment.replies);
                //                 }
                //                 return true;
                //             }
                //             return false;
                //         });
                //     };

                //     return filterDeletedComment(prevComments);
                // });

                // Create a new immutable version of the comments without the deleted one
                const removeCommentById = (comments, targetId) => {
                    return comments.reduce((acc, comment) => {
                        if (comment.id === targetId) {
                            return acc; // Skip this comment
                        }

                        // Create a new comment object with filtered replies
                        const newComment = {
                            ...comment,
                            replies: comment.replies
                                ? removeCommentById(comment.replies, targetId)
                                : undefined
                        };

                        return [...acc, newComment];
                    }, []);
                };

                setAllComments(prev => removeCommentById(prev, diaryCommentId));
            })
            .catch((error) => {
                console.log('Error:', error);
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
                setErrorMessage(finalresponse);
                return false;
            });
    }

    return (
        <div className="p-3">
            <h2 className="text-[16px] text-[#044093] font-semibold flex items-center gap-2 pb-2 pt-3 2xl:text-[32px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M7.49249 17.585C7.04249 17.585 6.61499 17.36 6.32249 16.9625L5.42251 15.7625C5.42251 15.77 5.385 15.7475 5.37 15.7475H5.09251C2.52751 15.7475 0.9375 15.05 0.9375 11.5925V8.5925C0.9375 5.43501 2.86501 4.61001 4.48501 4.46751C4.66501 4.44501 4.87501 4.4375 5.09251 4.4375H9.8925C12.6075 4.4375 14.0475 5.87751 14.0475 8.5925V11.5925C14.0475 11.81 14.04 12.02 14.01 12.2225C13.875 13.82 13.05 15.7475 9.8925 15.7475H9.5925L8.6625 16.9625C8.37 17.36 7.9425 17.585 7.49249 17.585ZM5.09251 5.5625C4.92001 5.5625 4.755 5.57 4.5975 5.585C2.8575 5.735 2.0625 6.68751 2.0625 8.5925V11.5925C2.0625 14.165 2.85751 14.6225 5.09251 14.6225H5.3925C5.73 14.6225 6.11249 14.81 6.32249 15.08L7.2225 16.2875C7.38751 16.5125 7.5975 16.5125 7.7625 16.2875L8.6625 15.0875C8.88 14.795 9.225 14.6225 9.5925 14.6225H9.8925C11.7975 14.6225 12.75 13.82 12.8925 12.11C12.915 11.93 12.9225 11.765 12.9225 11.5925V8.5925C12.9225 6.50001 11.985 5.5625 9.8925 5.5625H5.09251Z" fill="#044093" />
                    <path d="M7.49268 11.1425C7.07268 11.1425 6.74268 10.805 6.74268 10.3925C6.74268 9.98 7.08018 9.6425 7.49268 9.6425C7.90515 9.6425 8.24265 9.98 8.24265 10.3925C8.24265 10.805 7.91265 11.1425 7.49268 11.1425Z" fill="#044093" />
                    <path d="M9.89246 11.1425C9.47246 11.1425 9.14246 10.805 9.14246 10.3925C9.14246 9.98 9.47996 9.6425 9.89246 9.6425C10.305 9.6425 10.6425 9.98 10.6425 10.3925C10.6425 10.805 10.305 11.1425 9.89246 11.1425Z" fill="#044093" />
                    <path d="M5.09985 11.1425C4.67985 11.1425 4.34985 10.805 4.34985 10.3925C4.34985 9.98 4.68735 9.6425 5.09985 9.6425C5.51235 9.6425 5.84985 9.98 5.84985 10.3925C5.84985 10.805 5.51235 11.1425 5.09985 11.1425Z" fill="#044093" />
                    <path d="M13.4551 12.7175C13.3051 12.7175 13.1551 12.6575 13.0501 12.545C12.9301 12.425 12.8776 12.2525 12.9001 12.0875C12.9226 11.93 12.9301 11.765 12.9301 11.5925V8.5925C12.9301 6.50001 11.9926 5.5625 9.90008 5.5625H5.10009C4.92759 5.5625 4.76261 5.57 4.60511 5.585C4.44011 5.6075 4.2676 5.54749 4.1476 5.43499C4.0276 5.31499 3.96009 5.15001 3.97509 4.98501C4.11009 3.36501 4.94259 1.4375 8.10008 1.4375H12.9001C15.6151 1.4375 17.0551 2.87751 17.0551 5.59251V8.5925C17.0551 11.75 15.1276 12.575 13.5076 12.7175C13.4851 12.7175 13.4701 12.7175 13.4551 12.7175ZM5.19011 4.4375H9.8925C12.6075 4.4375 14.0475 5.87751 14.0475 8.5925L14.0476 11.495C15.3226 11.18 15.9226 10.2425 15.9226 8.5925V5.59251C15.9226 3.50001 14.9851 2.5625 12.8926 2.5625H8.09258C6.44261 2.5625 5.51261 3.1625 5.19011 4.4375Z" fill="#044093" />
                </svg> Comments ({commentCount || 0})
            </h2>
            {/* <div className="border-b border-gray-200 mb-4"></div> */}
            {
                isLogged === false ?
                    <div className='bg-[#0440933b] mb-1 flex items-center justify-center h-[80px] w-full leading-[24px]'>
                        <p className="text-center text-[15px] font-semibold 2xl:text-[30px]">Please login to comment.</p>
                        <button className='cursor-pointer ml-2 text-[#044093] text-[14px] font-semibold' onClick={() => { router.push('/login') }}>Login</button>
                    </div>
                    :
                    <>
                        <div className='flex items-start gap-2 '>
                            <Image
                                src={profilephoto}
                                alt="Profile Photo"
                                width={24}
                                height={24}
                                className="rounded-full 2xl:w-20 2xl:h-20"
                            />
                            <div className='w-full'>
                                <Textarea
                                    placeholder="Share your thoughts..."
                                    className={`!w-full p-2 !border !rounded-[2px] !bg-[#fff] mb-4 resize-none text-[12px] ${commentTextError ? "border-red-500" : "border-[#d1d5db]"}`}
                                    value={commentText}
                                    onChange={handleCommentTextChange}
                                    rows={3}
                                    textareaClassName='h-[60px] !bg-[#fff] 2xl:text-[32px]'
                                />
                                {commentTextError && <p className='text-red-500 text-[12px] mb-2'>{commentTextError}</p>}
                            </div>
                        </div>
                        <div className='flex'>
                            <button
                                disabled={!commentText || isLoading}
                                onClick={submitComment}
                                className={`!text-white text-[12px] !px-2 !py-1 rounded mb-6 ml-auto ${commentText ? "cursor-pointer bg-[#044093]" : "cursor-not-allowed bg-[rgba(4,64,147,0.75)]"} 2xl:text-[28px] 2xl:px-8 2xl:mt-4`}>
                                Post Comment
                            </button>
                        </div>
                    </>
            }

            {/* Comments List */}
            <div className="overflow-y-auto max-h-[calc(100vh-360px)]">
                <div className="space-y-6">
                    {
                        commentsLoading === false ? (
                            allComments.length !== 0 ?
                                allComments.map((comment) => (
                                    <div key={comment.id} className="pb-4">
                                        <div className='flex items-center justify-between gap-2'>
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
                                            <p className="font-semibold text-[14px] text-[#000] 2xl:text-[28px] 2xl:font-semibold">{comment?.user_name || 'N/A'}</p>
                                            <p className="text-gray-400 text-xs ml-auto 2xl:text-[20px]">{dayjs(comment?.created_at).format('DD MMM YYYY')}</p>
                                        </div>
                                        <p className="text-[12px] text-[#2b2b2b] mt-2 pl-8 2xl:text-[20px]">
                                            {comment?.comment}
                                        </p>
                                        {
                                            isLogged &&
                                            <div className="flex items-center gap-4 text-gray-500 text-sm pl-8 pt-2">
                                                <div className='cursor-pointer flex items-center' onClick={() => handleSubmitLike(comment.id)}>
                                                    <div className='flex flex-row items-center gap-1'>
                                                        {
                                                            comment?.commentLikes?.length > 0 &&
                                                                comment?.commentLikes?.filter((like) => like.user_id === user_id).length > 0 ? (
                                                                <IconHeartFilled className='w-4 h-4 2xl:w-7 2xl:h-7' color='red' />
                                                            ) : (
                                                                <IconHeart className='w-4 h-4 2xl:w-7 2xl:h-7' />
                                                            )
                                                        }
                                                        <p className='text-[12px] text-[#2b2b2b] 2xl:text-[20px] 2xl:gap-1'>{comment?.likeCount || 0} Likes</p>
                                                    </div>
                                                </div>
                                                <button className='flex items-center cursor-pointer 2xl:text-[20px] 2xl:gap-1' onClick={() => handleReply(comment.id)}>
                                                    <IconBrandLine className='w-4 h-4 2xl:w-7 2xl:h-7' /> Reply
                                                </button>
                                                {
                                                    diaryPageDetails?.author_details?.author_uid === user_uid &&
                                                    <Button onClick={() => openDeleteDiaryCommentModal(comment.id)} variant="light" className="!p-1 flex items-center justify-center !text-[#fff] cursor-pointer !rounded-full !bg-[#B91C1C]">
                                                        <IconTrash size={14} />
                                                    </Button>

                                                }
                                            </div>
                                        }
                                        {/* Replies Section */}
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
                                        {
                                            comment?.replies?.length > 0 && (
                                                <div className="ml-4 mt-4">
                                                    {
                                                        comment?.replies?.map(comment => (
                                                            <CommentReplyItem
                                                                key={comment.id}
                                                                comment={comment}
                                                                handleReply={handleReply}
                                                                replyText={replyText}
                                                                handleReplyTextChange={handleReplyTextChange}
                                                                replyTextError={replyTextError}
                                                                isLoading={isLoading}
                                                                handleSubmitReply={handleSubmitReply}
                                                                parentCommentId={parentCommentId}
                                                                setParentCommentId={setParentCommentId}
                                                                handleSubmitLike={handleSubmitLike}
                                                                user_id={user_id}
                                                                openDeleteDiaryCommentModal={openDeleteDiaryCommentModal}
                                                                diaryPageDetails={diaryPageDetails}
                                                                user_uid={user_uid}
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
            <DeleteModal
                size={modalSize}
                title="Delete Diary Comment"
                message="Are you sure you want to delete this comment?"
                open={deleteDiaryCommentModal}
                onClose={closeDeleteDiaryCommentModal}
                onConfirm={handleDeleteComment}
            />
            {
                errorMessage !== "" &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </div>
    )
}

export default Comments
