'use client'
import { useEffect, useState } from 'react';
import Diariesapi from '../api/Diariesapi'
import { Button } from '@nayeshdaggula/tailify';
import Errorpanel from '../shared/Errorpanel';
import avatar from "@/public/assets/avatarimg.webp";
import Diarycard from '../shared/Diarycard';
function Featureditems() {
  const [diariesData, setDiariesData] = useState([]);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const take = 4;
  const [totalDiaries, setTotalDiaries] = useState(0);

  async function getFeaturedDiaries(currentSkip = 0, isFresh = false) {
    setIsLoadingEffect(true);
    Diariesapi.get('getfeatureddiaries', {
      params: {
        skip: currentSkip,
        take: take
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
        setTotalDiaries(totalDiariesCount || 0);
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
    getFeaturedDiaries(0, true);
  }, []);

  return (
    <div className=' h-fit w-full mb-8'>
      <div className=" md:bg-[#ffb200] bg-transparent flex flex-col items-center justify-start md:h-[50vh] h-fit w-full space-y-[2vh] md:pt-[8vh] pt-7">
        <p className="capitalize text-[26px] md:text-[40px] text-[#141414] font-roboto font-[700] leading-tight 2xl:text-[42px]">
          Featured Diaries
        </p>
        <p className="text-base md:font-medium font-normal text-center md:w-[55%] w-full px-5 mb-6 md:mb-4 text-[#2b2b2b]/60 2xl:text-[30px]">
          Discover inspiring stories and reflections from our community. Dive into these handpicked
          diaries that showcase creativity, growth, and personal journeys.
        </p>
      </div>
      <div className="mt-0 md:mt-[-85px] px-[3.3vw] w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {
            isLoadingEffect === false ? (
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
                <div className="col-span-full flex justify-center items-center min-h-[200px] w-full">
                  <div className="bg-white border border-[#D7D8D9] rounded-md px-6 py-4 w-[80%] md:w-[50%] h-[50%] flex items-center justify-center">
                    <p className="text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[28px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">
                      No Featured Diaries Found
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="col-span-full flex justify-center items-center min-h-[200px] w-full">
                <div className="bg-white border border-[#D7D8D9] rounded-md px-6 py-4">
                  <p className="text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">
                    Loading Diaries...
                  </p>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {hasMore && (
        <div className="flex flex-row justify-center items-center mt-8">
          <Button
            className="mt-[5vh] font-inter font-[500] text-[12px] md:text-[14px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] px-[1.5vw] py-[0.5vw] rounded-[5px] border-[0.8px] border-[#2b2b2b]"
            onClick={() => getFeaturedDiaries(diariesData?.length)}
            disabled={isLoadingEffect}
          >
            {isLoadingEffect ? "Loading..." : "View More"}
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

export default Featureditems;