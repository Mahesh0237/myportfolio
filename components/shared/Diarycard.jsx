"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { IconEye, IconMessageCircle, IconShare3, IconThumbUp } from "@tabler/icons-react";
 
function Diarycard({
    posterimage,
    title,
    authorimage,
    authorname,
    posteddate,
    description,
    href,
    diary_type,
    likes,
    diary_view_count,
    diary_share_count,
    diary_comment_count
 
}) {
    return (
        <div className="h-full w-full flex flex-col border-[1px] border-[#2B2B2B]/10 rounded-tl-sm rounded-tr-sm bg-white shadow-sm transition-shadow duration-300">
            {/* Image section - fixed height */}
            <div className="relative h-[250px] 2xl:h-[320px] 4xl:h-[420px] w-full overflow-hidden rounded-tl-sm rounded-tr-sm">
                <Image
                    src={posterimage}
                    alt="Poster image"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    fill
                />
            </div>
 
            {/* Content section - flex-grow to take remaining space */}
            <div className="flex-grow flex flex-col p-2 bg-[#ffffff]">
                {/* Title - fixed line */}
 
                <div className="flex gap-2 justify-between px-2">
                    <div>
                        <p className="text-[#2B2B2B] text-[16px] md:text-[16px] 2xl:text-[20px] 3xl:text-[24px] 4xl:text-[28px] font-[700] capitalize mb-2 line-clamp-1">
                            {title}
                        </p>
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex flex-row items-center gap-2">
                                <div className="h-8 w-10 2xl:h-10 2xl:w-10 4xl:h-12 4xl:w-12 rounded-full overflow-hidden">
                                    <Image
                                        width={40}
                                        height={30}
                                        src={authorimage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <p className="text-[#2B2B2B] text-[14px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[25px] font-[600] line-clamp-1">
                                        {authorname}
                                    </p>
                                    <p className="text-[#2B2B2Bcc] text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[24px] font-[600] ">
                                        {dayjs(posteddate).format("MMM DD, YYYY")}
                                    </p>
                                </div>
                            </div>
                            {
                                diary_type &&
                                <>
                                    {
                                        diary_type === "Group" ?
                                            <div className="bg-[#4CAF50]  px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                                <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[20px] font-[600]">
                                                    {diary_type}
                                                </p>
                                            </div>
                                            :
                                            diary_type === "Subscription" ?
                                                <div className="bg-[#673AB7]  px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                                    <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[20px] font-[600]">
                                                        {diary_type}
                                                    </p>
                                                </div>
                                                :
                                                <div className="bg-[#FF9800] px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                                    <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[20px] font-[600]">
                                                        {diary_type}
                                                    </p>
                                                </div>
                                    }
                                </>
                            }
                        </div>
 
                        {/* Description - flexible space with min-height */}
                        <div className="flex-grow  min-h-[60px] mb-2">
                            {description ? (
                                <p className="text-black/60 text-[14px] 3xl:text-[16px] line-clamp-3 text-">
                                    {description
                                        .replace(/<img[^>]*>/g, '')
                                        .replace(/<\/?[^>]+(>|$)/g, '')
                                        .split(/\s+/)
                                        .slice(0, 15)
                                        .join(' ') +
                                        (description.replace(/<img[^>]*>/g, '').replace(/<\/?[^>]+(>|$)/g, '').split(/\s+/).length > 15 ? '...' : '')
                                    }
                                </p>
                            )
                                :
                                <p className="text-black/60 text-[14px] line-clamp-3 text-">No content avialable</p>
                            }
                        </div>
                    </div>
                </div>
 
                {/* Button - fixed height */}
                <div className="flex flex-row items-center justify-center gap-4 md:gap-6 pb-2 md:pb-4">
                    <div className="flex flex-row items-center gap-1">
                        <IconThumbUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        <p className="text-[10px] sm:text-[12px] md:text-[14px]">
                            {likes ? likes : 0}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <IconMessageCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        <p className="text-[10px] sm:text-[12px] md:text-[14px]">
                            {diary_comment_count || 0}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <IconShare3 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        <p className="text-[10px] sm:text-[12px] md:text-[14px]">
                            {diary_share_count || 0}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <IconEye className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        <p className="text-[10px] sm:text-[12px] md:text-[14px]">
                            {diary_view_count || 0}
                        </p>
                    </div>
                </div>
                <Link
                    href={href || `#`}
                    className="rounded-md py-2 w-full font-inter font-[500] text-[13px] 2xl:text-[16px] 2xl:py-3 md:text-[14px] text-[#fff] bg-[#044093] border-b-[1px] text-center"
                >
                    View Diary
                </Link>
            </div>
        </div>
    );
}
 
export default Diarycard;
 