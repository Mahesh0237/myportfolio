"use client";
import SingleCardComponent from "./SingleCardComponent";
import { useCallback, useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import Diariesapi from "@/components/api/Diariesapi";
import Errorpanel from "@/components/shared/Errorpanel";
import avatar from "@/public/assets/avatarimg.webp";

function Diarieswrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [diariesData, setDiariesData] = useState([]);

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 10;
  const [totalDiaries, setTotalDiaries] = useState(0);

  async function getAllDiaries(currentSkip = 0, isFresh = false) {
    setIsLoadingEffect(true);
    Diariesapi.get('getdiaries', {
      params: {
        skip: currentSkip,
        take: take,
        searchQuery: searchQuery
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
    getAllDiaries(0, true);
  }, [searchQuery]);

  const updateSearchQuery = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === "") {
      setHasMore(true);
      setDiariesData([]);
      setSkip(0);
      setTotalDiaries(0);
      setIsLoadingEffect(false);
      setErrorMessage("");
      getAllDiaries(0, true);
    }
  }, []);

  return (
    <>
      <div className="flex max-sm:flex-wrap justify-between pb-2 mb-2 border-t-0 border-r-0 border-b-[0.6px] border-l-0 border-[#979797]/30">
        <div className="pl-1 max-sm:text-center max-sm:w-full max-sm:mb-[10px]">
          <h1 className="text-xl md:text-lg font-semibold max-sm:text-center">
            Diaries
          </h1>
        </div>
        <div className="flex max-sm:flex-wrap max-sm:gap-[10px] justify-end max-sm:justify-center items-center">
          <div className="border border-[#ced4da] rounded-sm ml-2 relative">
            <input
              type="text"
              placeholder="Search diaries..."
              className="focus:outline-none text-sm pl-6 py-1 "
              value={searchQuery}
              onChange={updateSearchQuery}
            />
            <div className="absolute left-0 top-2 px-1">
              <IconSearch size={16} color="#ced4da" />
            </div>
          </div>
        </div>
      </div>

      <div className='relative h-[calc(100vh-150px)] overflow-y-auto'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {
            isLoadingEffect === false ? (
              diariesData.length > 0 ? (
                diariesData.map((post) => (
                  <SingleCardComponent
                    key={post.id}
                    href={`/admin/diarydetails/${post.uuid}`}
                    posterimage={post?.diarycontent[0]?.content_image || post.featured_image_url}
                    authorname={post.author_name}
                    authorimage={post.author_image || avatar}
                    title={post.name}
                    posteddate={post.created_at}
                    description={post?.diarycontent[0]?.content ? post.diarycontent[0].content : null}
                  />
                ))
              ) : (
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
              )
            ) :
              <div className="col-span-12 flex flex-row justify-center items-center ">
                <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                  <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>Loading Diaries...</p>
                </div>
              </div>
          }
        </div>
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => getAllDiaries(diariesData?.length)}
              className="px-4 py-1 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
              disabled={isLoadingEffect}
            >
              {isLoadingEffect ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {
          errorMessage !== '' &&
          <Errorpanel
            errorMessages={errorMessage}
          />
        }
      </div>
    </>
  );
}

export default Diarieswrapper;