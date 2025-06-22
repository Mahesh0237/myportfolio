"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nayeshdaggula/tailify";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function SingleDiaryCard({
  posterimage,
  title,
  authorimage,
  authorname,
  posteddate,
  description,
  diaryUid,
  setIsNormalLoading,
  link
}) {
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  // const onClickEdit = () => {
  //   setIsNormalLoading(true);
  //   router.push(`/myaccount/diary/edit?uid=${diaryUid}`);
  // }
  // const viewDiary = () => {
  //   setIsNormalLoading(true);
  //   router.push(`/myaccount/diary/${title}?uid=${diaryUid}`);
  // }
  const viewDiary = () => {
    setIsNormalLoading(true);
    router.push(`${link}`);
  };

  return (
    <div className="h-fit w-full space-y-[1vh] border-[1px] border-[#2B2B2B]/10 !rounded-tl-sm !rounded-tr-sm bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-[200px] 2xl:h-[325px] w-full overflow-hidden !rounded-tl-md !rounded-tr-md" 
      // style={{ zIndex: 10 }}
      >
        {posterimage ?
          <Image
            src={posterimage}
            alt="Poster image"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            fill
            // style={{ zIndex: 10 }}
          //   width={500}
          //   height={300}
          />
          :
          <p className="h-full w-full justify-start items-center flex">Image Not found</p>
        }

      </div>
      <div className="px-2 pb-2 space-y-2">
        <p className="text-[#2B2B2B] text-[21px] md:text-[18px] font-[700] truncate max-w-[200px] 2xl:text-[28px] 2xl:font-semibold capitalize">
          {title}
        </p>

        <div className="flex items-center justify-start gap-2">
          <Image
            src={authorimage}
            alt="Author image"
            className="w-9 h-9 2xl:h-16 2xl:w-16 object-cover rounded-full border-[#000] border-[0.8px]"
            width={40}
            height={40}
          />
          <div className="flex flex-col items-start">
            <p className="text-[#2B2B2B] text-[16px] md:text-[14px] font-[600] 2xl:text-[28px]">
              {authorname}
            </p>
            <p className="text-[12px] md:text-[10px] font-[400] 2xl:text-[22px]">
              {dayjs(posteddate).format("DD MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* <p className={`text-[#2B2B2B]/60 text-[12px] font-[500] truncate max-w-3xl ${showFull ? "" : "line-clamp-1 2xl:text-[22px]"
            }`} dangerouslySetInnerHTML={{ __html: description }} /> */}
            {description &&
        <p className="text-black/60 text-[14px]">
          {
            description
              .replace(/<img[^>]*>/g, '') // remove <img> tags
              .replace(/<\/?[^>]+(>|$)/g, '') // remove all other HTML tags
              .split(/\s+/) // split into words
              .slice(0, 15)
              .join(' ') +
            (description.replace(/<img[^>]*>/g, '').replace(/<\/?[^>]+(>|$)/g, '').split(/\s+/).length > 15 ? '...' : '')
          }
        </p>
      }
 

          {/* {
            description &&
            description?.length > 30 && (
              <button
                className="inline-block text-blue-600 text-[12px] font-medium underline"
                onClick={() => setShowFull((prev) => !prev)}
              >
                {showFull ? "See less" : "See more..."}
              </button>
            )} */}
        </div>
        <div className="flex justify-around">
          <Button onClick={viewDiary} className="!rounded-md !w-full font-inter font-[500] text-[13px] 2xl:text-[24px] 2xl:py-3 md:text-[14px]  !text-[#fff] !bg-[#044093] border-b-[1px]">
            View Diary
          </Button>
        </div>
      </div>
    </div >
  );
}

export default SingleDiaryCard;
