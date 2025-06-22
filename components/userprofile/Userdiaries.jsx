"use client";
import React, { useEffect, useState } from "react";
import { Button, Loadingoverlay } from "@nayeshdaggula/tailify";
import Diariesapi from "@/components/api/Diariesapi";
import avatar from "@/public/assets/avatarimg.webp";
import Diarycard from "../shared/Diarycard";
import Errorpanel from "../shared/Errorpanel";

function Userdiaries({ useruid }) {
    const [diariesData, setDiariesData] = useState([]);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const take = 3;
    const [errorMessage, setErrorMessage] = useState('')

    async function getUserDiaries(currentSkip = 0, useruid, isFresh = false) {
        setIsLoadingEffect(true);
        Diariesapi.get('getuserdiaries', {
            params: {
                skip: currentSkip,
                take: take,
                user_uid: useruid
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                const { diaries = [], totalDiariesCount } = response.data;
                const loadedDiariesCount = isFresh ? diaries?.length : diariesData?.length + diaries?.length;
                if (loadedDiariesCount >= totalDiariesCount) {
                    setHasMore(false);
                }
                setIsLoadingEffect(false);
                setDiariesData(prev => isFresh ? diaries : [...prev, ...diaries]);
                setSkip(prev => prev + take);
                // setTotalDiaries(totalDiariesCount || 0);
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
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }

    useEffect(() => {
        getUserDiaries(0, useruid, true);
    }, [useruid]);

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1vw]">
                {
                    isLoadingEffect === false ? (
                        diariesData.length > 0 ? (
                            diariesData.map((post, index) => (
                                <Diarycard
                                    key={index}
                                    href={`/diarydetails/${post.uuid}/${post?.diarycontent?.page_no || 1}`}
                                    posterimage={post?.diarycontent?.content_image || post.featured_image_url}
                                    authorname={post.author_name}
                                    authorimage={post.author_image || avatar}
                                    title={post.name}
                                    posteddate={post.created_at}
                                    description={post?.diarycontent?.content ? post.diarycontent.content : null}
                                    likes={post.likes_count || 0}
                                    diary_view_count={post?.diarycontent?.view_count ? post.diarycontent?.view_count : null}
                                    diary_share_count={post?.diarycontent?.share_count ? post.diarycontent?.share_count : null}
                                    diary_comment_count={post?.diarycontent?.comment_count ? post.diarycontent?.comment_count : null}
                                />
                            ))
                        ) : (
                            <div className="col-span-12 flex flex-row justify-center items-center ">
                                <div className='w-[85%] md:w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                                </div>
                            </div>
                        )
                    )
                        :
                        <div className="col-span-12 flex flex-row justify-center items-center ">
                            <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                                <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>Loading Diaries...</p>
                            </div>
                        </div>
                }
            </div>

            {hasMore && (
                <div className="mt-auto mx-auto flex flex-row justify-center items-center">
                    <Button
                        className="mt-[5vh] font-inter font-[500] text-[12px] md:text-[14px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] rounded-[5px] border-[0.8px] border-[#2b2b2b]"
                        onClick={() => getUserDiaries(diariesData?.length, useruid)}
                        disabled={isLoadingEffect}
                    >
                        {isLoadingEffect ? "Loading..." : "View More"}
                    </Button>
                </div>
            )}
            {
                isLoadingEffect &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                </div>
            }
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </div>
    );
}

export default Userdiaries;
