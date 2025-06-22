"use client";
import React, { useEffect, useState } from "react";
import { Button, Loadingoverlay, Select, Textinput } from "@nayeshdaggula/tailify";
import Diariesapi from "@/components/api/Diariesapi";
import Errorpanel from "../shared/Errorpanel";
import avatar from "@/public/assets/avatarimg.webp";
import Diarycard from "../shared/Diarycard";

function Latestdiaries() {
    const [diariesData, setDiariesData] = useState([]);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const take = 4;
    const [totalDiaries, setTotalDiaries] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryError, setSelectedCategoryError] = useState("");
    const onCategorySelect = (value) => {
        setSelectedCategory(value);
        setSelectedCategoryError("");
    };

    const [searchQuery, setSearchQuery] = useState('')
    const updateSearchQuery = (e) => {
        setSearchQuery(e.currentTarget.value)
        if (e.currentTarget.value === "") {
            setHasMore(true)
        }
    }

    // async function getFrontendDiaries(currentSkip = 0, isFresh = false) {
    async function getFrontendDiaries(currentSkip = 0, isFresh = false, category, searchQuery) {
        setIsLoadingEffect(true);
        Diariesapi.get('getfrontenddiaries', {
            params: {
                skip: currentSkip,
                take: take,
                category: category,
                searchQuery: searchQuery,
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
                // const newDiaries = data.diaries;
                // if (newDiaries.length < take) {
                //     setHasMore(false);  // Disable "Load More" when fewer than requested records are returned
                // }
                // setDiariesData([...diariesData, ...newDiaries]);
                // setSkip(skip + take);
                // setIsLoadingEffect(false);
                // return false;

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

    const getCategories = () => {
        Diariesapi.get("/getcategories")
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalresponse);
                    return false;
                }
                setErrorMessage("");
                setCategories(data?.categories || []);
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
                return false;
            });
    };

    const handleSearch = () => {
        getFrontendDiaries(0, true, selectedCategory, searchQuery);
    }

    useEffect(() => {
        getFrontendDiaries(0, true);
        getCategories();

    }, []);

    return (
        <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[1vh] flex flex-col">
            <p className="text-[#2B2B2B] text-[27px] md:text-[28px] font-[700] text-center 2xl:text-[42px]">
                Latest Posted Diaries
            </p>
            <p className="text-[#2B2B2B]/60 text-center text-[14px] md:text-[14px] md:font-[500] font-normal pb-[2vh] 2xl:text-[30px]">
                Explore heartfelt stories and inspiring moments from our community.
            </p>
            <div className="flex flex-col md:flex-row h-fit border-[#c8e1ff] bg-[#f1f5f9] w-full md:w-fit shadow-md mx-auto py-4 mb-8  rounded-sm md:rounded-full md:px-4 gap-4 md:gap-0">
                <div className=" md:border-r-1 border-[#2B2B2B99] px-4">
                    <Select
                        placeholder='Select category'
                        data={categories}
                        withAsterisk
                        selectWrapperClass="!w-full md:!w-[200px] !shadow-none !bg-[#fff] !text-[#4a5565] !px-4 !h-9 !border-[#fff]"
                        dropDownClass="!w-full md:!w-[200px] mx-auto border-[#2B2B2B99]/60"
                        value={selectedCategory}
                        onChange={onCategorySelect}
                        error={selectedCategoryError}

                    />
                </div>
                <div className="px-4">
                    <Textinput
                        placeholder='Search author or diary'
                        inputClassName='!w-full md:!w-[200px] !shadow-none !bg-[#fff] !text-[#4a5565] !px-4 !h-9 !border-[#fff]'
                        value={searchQuery}
                        onChange={updateSearchQuery}
                    />
                </div>
                <div className=" md:border-l-1 border-[#2B2B2B99] px-4">
                    <Button onClick={handleSearch} className="!bg-[#044093] !w-full md:!w-[200px] !text-[#fff] !text-sm !h-9 !border-none">
                        Search
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[1vw]">
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
                                <div className='w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
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

            {/* Load More */}
            {hasMore && (
                <div className="mt-auto mx-auto">
                    <Button
                        className="mt-[5vh] font-inter font-[500] text-[12px] md:text-[14px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] rounded-[5px] border-[0.8px] border-[#2b2b2b]"
                        onClick={() => getFrontendDiaries(diariesData?.length)}
                        disabled={isLoadingEffect}
                    >
                        {isLoadingEffect ? "Loading..." : "View More"}
                    </Button>
                </div>
            )}
            {isLoadingPage && <Loadingoverlay visible={isLoadingPage} overlayBg="#2b2b2bcc" />}
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </div>
    );
}

export default Latestdiaries;
