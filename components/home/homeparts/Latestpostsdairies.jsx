"use client";
import React, { useEffect, useState } from "react";
import Latestpostsdairiescard from "./Latestpostsdairiescard";
import { Button } from "@nayeshdaggula/tailify";
import Diariesapi from "@/components/api/Diariesapi";
import { useRouter } from "next/navigation";
import Errorpanel from "@/components/shared/Errorpanel";
import avatar from "@/public/assets/avatarimg.webp";
import Diarycard from "@/components/shared/Diarycard";

function Latestpostsdairies() {
  const router = useRouter();
  const [diariesData, setDiariesData] = useState([]);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  async function getLatestdiaries() {
    setIsLoadingEffect(true);
    Diariesapi.get("getlatestdiaries")
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            "message": data.message,
            "server_res": data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return;
        }
        setIsLoadingEffect(false);
        setTotalCount(data?.totalDiariesCount || 0);
        setDiariesData(data?.diaries || []);
      })
      .catch((error) => {
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
    getLatestdiaries();
  }, []);

  const handleLoadMore = () => {
    router.push("/diaries");
  };

  return (
    <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[1vh] flex flex-col">
      <p className="text-[#2B2B2B] text-[16px] md:text-[24px] 2xl:text-[28px] 3xl:text-[32px] 4xl:text-[38px] font-[700] text-center">
        Latest Posted Diaries
      </p>
      <p className="text-[#2B2B2B]/60 text-center text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[500] pb-[2vh]">
        Explore heartfelt stories and inspiring moments from our community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-[1vw]">
        {
          !isLoadingEffect ? (
            diariesData.length > 0 ? (
              diariesData.map((post) => (
                <Diarycard
                  key={post.id}
                  href={`/diarydetails/${post.uuid}/${post?.diarycontent?.page_no || 1}`}
                  posterimage={post?.diarycontent?.content_image || post.featured_image_url}
                  authorname={post.author_name}
                  authorimage={post.author_image || avatar}
                  title={post.name}
                  posteddate={post.created_at}
                  description={post?.diarycontent?.content ? post.diarycontent.content : null}
                  likes={post.diary_like_count || 0}
                  diary_view_count={post?.diarycontent?.view_count ? post.diarycontent?.view_count : null}
                  diary_share_count={post?.diarycontent?.share_count ? post.diarycontent?.share_count : null}
                  diary_comment_count={post?.diarycontent?.comment_count ? post.diarycontent?.comment_count : null}
                />
              ))
            ) : (
              <div className="col-span-12 flex flex-row justify-center items-center ">
                <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                  <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-12 flex flex-row justify-center items-center ">
              <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>Loading Diaries...</p>
              </div>
            </div>
          )
        }
      </div>

      {/* Load More */}
      {totalCount > 4 && (
        <div className="mt-auto mx-auto">
          <Button
            className="md:mt-[5vh] !h-9 md:!h-fit font-inter font-[500] text-[12px] md:text-[14px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] !px-[4vw] !py-[0.5vw] rounded-[5px] border-[0.8px] border-[#2b2b2b]"
            onClick={handleLoadMore}
            disabled={isLoadingEffect}
          >
            View More
          </Button>
        </div>
      )}
      {
        errorMessage !== '' &&
        <Errorpanel
          errorMessages={errorMessage}
        />
      }
    </div>
  );
}

export default Latestpostsdairies;
