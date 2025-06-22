'use client'
import { useUserDetails } from "@/components/zustand/useUserDetails";
import React, { useEffect, useState } from "react";
import Diariesapi from "@/components/api/Diariesapi";
import DiaryCardSkeleton from "./DiaryCardSkeleton";
import Errorpanel from "@/components/shared/Errorpanel";
import avatar from "@/public/assets/avatarimg.webp";
import Diarycard from "@/components/shared/Diarycard";
import TableLoadingEffect from "@/components/shared/Tableloadingeffect";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { Card, Drawer, Pagination } from "@nayeshdaggula/tailify";
import Editcontributedcontent from "../contributionrequests/Editcontributedcontent";
import { Button } from "@nayeshdaggula/tailify";
import { IconCirclePlus } from "@tabler/icons-react";

const LIMIT = 4;

function Diarywrapper({ user_uid }) {
  const userInfo = useUserDetails((state) => state.user_info);
  const [diariesData, setDiariesData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingEffect, setIsLoadingEffect] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  async function getMyDiaries(newOffset = 0, append = false) {
    setIsLoadingEffect(true);
    try {
      const response = await Diariesapi.get("getMyDiaries", {
        params: {
          user_uid: user_uid,
          limit: LIMIT,
          offset: newOffset,
        },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return;
      }

      setTotalCount(data.totalDiariesCount);

      if (append) {
        setDiariesData((prev) => [...prev, ...data.diaries]);
      } else {
        setDiariesData(data.diaries);
      }
      setErrorMessage('');
      setOffset(newOffset + LIMIT);
      setIsLoadingEffect(false);
      return false;
    } catch (error) {
      const finalresponse = {
        message: error.message,
        server_res: error.response ? error.response.data : null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return;
    }
  }

  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitedDiaries, setInvitedDiaries] = useState([]);
  const [invitedOffset, setInvitedOffset] = useState(0);
  const [invitedTotalCount, setInvitedTotalCount] = useState(0);

  const [groupInvitationLoading, setGroupInvitationLoading] = useState(false);
  const [groupInvitedDiaries, setGroupInvitedDiaries] = useState([]);
  const [groupInvitedOffset, setGroupInvitedOffset] = useState(0);
  const [groupInvitedTotalCount, setGroupInvitedTotalCount] = useState(0);

  async function getInvitedDiaries(newOffset = 0, append = false) {
    if (!userInfo?.user_id) return;

    setInvitationLoading(true);
    try {
      const response = await Diariesapi.get("getinviteddiaries", {
        params: {
          user_id: userInfo?.user_id,
          limit: LIMIT,
          offset: newOffset,
        },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setInvitationLoading(false);
        return;
      }

      setInvitedTotalCount(data.totalDiariesCount);

      if (append) {
        setInvitedDiaries((prev) => [...prev, ...data.diaries]);
      } else {
        setInvitedDiaries(data?.diaries || []);
      }
      setErrorMessage('');
      setInvitedOffset(newOffset + LIMIT);
      setInvitationLoading(false);
      return false;
    } catch (error) {
      const finalresponse = {
        message: error.message,
        server_res: error.response ? error.response.data : null,
      };
      setErrorMessage(finalresponse);
      setInvitationLoading(false);
      return;
    }
  }

  async function getGroupInvitedDiaries(newOffset = 0, append = false) {
    if (!userInfo?.user_id) return;

    setGroupInvitationLoading(true);
    try {
      const response = await Diariesapi.get("getgroupinviteddiaries", {
        params: {
          user_id: userInfo?.user_id,
          limit: LIMIT,
          offset: newOffset,
        },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setGroupInvitationLoading(false);
        return;
      }

      setGroupInvitedTotalCount(data.totalDiariesCount);

      if (append) {
        setGroupInvitedDiaries((prev) => [...prev, ...data.diaries]);
      } else {
        setGroupInvitedDiaries(data?.diaries || []);
      }
      setErrorMessage('');
      setGroupInvitedOffset(newOffset + LIMIT);
      setGroupInvitationLoading(false);
      return false;
    } catch (error) {
      const finalresponse = {
        message: error.message,
        server_res: error.response ? error.response.data : null,
      };
      setErrorMessage(finalresponse);
      setGroupInvitationLoading(false);
      return;
    }
  }

  const [subscribedLoading, setSubscribedLoading] = useState(false);
  const [subscriptionDiaries, setSubscriptionDiaries] = useState([]);
  const [subscriptionDiariesOffset, setSubscriptionDiariesOffset] = useState(0);
  const [subscriptionDiariesTotalCount, setSubscriptionDiariesTotalCount] = useState(0);

  async function getSubscribedDiaries(newOffset = 0, append = false) {
    setSubscribedLoading(true);
    try {
      const response = await Diariesapi.get("getsubscriptiondiaries", {
        params: {
          user_id: userInfo?.user_id,
          limit: LIMIT,
          offset: newOffset,
        },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setSubscribedLoading(false);
        return;
      }

      setSubscriptionDiariesTotalCount(data?.totalDiariesCount || 0);

      if (append) {
        setSubscriptionDiaries((prev) => [...prev, ...data.diaries]);
      } else {
        setSubscriptionDiaries(data?.diaries || []);
      }
      setErrorMessage('');
      setSubscriptionDiariesOffset(newOffset + LIMIT);
      setSubscribedLoading(false);
      return false;
    } catch (error) {
      const finalresponse = {
        message: error.message,
        server_res: error.response ? error.response.data : null,
      };
      setErrorMessage(finalresponse);
      setSubscribedLoading(false);
      return;
    }
  }

  const [followedDiriesLoading, setFollowedDiariesLoading] = useState(false);
  const [followedDiaries, setFollowedDiariesDiaries] = useState([]);
  const [followedDiariesOffset, setFollowedDiariesOffset] = useState(0);
  const [followedDiariesTotalCount, setFollowedDiariesTotalCount] = useState(0);

  async function getFollowedDiaries(newOffset = 0, append = false) {
    if (!userInfo?.user_id) return;

    setFollowedDiariesLoading(true);
    try {
      const response = await Diariesapi.get("getfolloweddiaries", {
        params: {
          user_id: userInfo?.user_id,
          limit: LIMIT,
          offset: newOffset,
        },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setFollowedDiariesLoading(false);
        return;
      }

      setFollowedDiariesTotalCount(data.totalDiariesCount);

      if (append) {
        setFollowedDiariesDiaries((prev) => [...prev, ...data.diaries]);
      } else {
        setFollowedDiariesDiaries(data?.diaries || []);
      }
      setErrorMessage('');
      setFollowedDiariesOffset(newOffset + LIMIT);
      setFollowedDiariesLoading(false);
      return false;
    } catch (error) {
      const finalresponse = {
        message: error.message,
        server_res: error.response ? error.response.data : null,
      };
      setErrorMessage(finalresponse);
      setFollowedDiariesLoading(false);
      return;
    }
  }

  const [myContributionsLoading, setMyContributionsLoading] = useState(false);
  const [myContributions, setMyContributionsDiaries] = useState([]);
  const [myContributionsTotalCount, setMyContributionsTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const onpagechange = (page) => {
    setPage(page);
    getMyDiaryContributions(page);
  };

  const user_id = userInfo?.user_id || null;
  const access_token = useUserDetails((state) => state.access_token);

  const [isContentDrawer, setIsContentDrawer] = useState(false);
  const [singleContribution, setSingleContribution] = useState('');
  const openReviewContent = (content) => {
    setSingleContribution(content)
    setIsContentDrawer(true);
  }
  const closeReviewContent = () => {
    setIsContentDrawer(false);
    setSingleContribution('');
  }
  const [isEditContentDrawer, setIsEditContentDrawer] = useState(false);
  const openEditContent = (content) => {
    setSingleContribution(content)
    setIsEditContentDrawer(true);
  }
  const closeEditContent = () => {
    setIsEditContentDrawer(false);
    setSingleContribution('');
  }
  const getMyDiaryContributions = (newPage) => {
    if (!userInfo?.user_id) return;
    setMyContributionsLoading(true);
    Diariesapi.get("getmydiarycontributiondetails", {
      params: {
        user_id: user_id,
        page: newPage,
        limit: 10
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          const finalResponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalResponse);
          setMyContributionsLoading(false);
          return false;
        }
        setErrorMessage("");
        setMyContributionsTotalCount(data?.totalpages);
        setMyContributionsDiaries(data?.alldiarycontributions || []);
        setMyContributionsLoading(false);
        return false;
      })
      .catch((error) => {
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setMyContributionsLoading(false);
        return false;
      });
  };

  const refreshMyContributions = () => {
    getMyDiaryContributions(1);
  }

  const [activeTab, setActiveTab] = useState('my_diaries');
  const onTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'my_diaries') {
      getMyDiaries();
    } else if (tab === 'invited_private_diaries') {
      getInvitedDiaries();
    } else if (tab === 'invited_group_diaries') {
      getGroupInvitedDiaries();
    }
    else if (tab === 'subscription_diaries') {
      getSubscribedDiaries()
    } else if (tab === "followed_diaries") {
      getFollowedDiaries()
    } else if (tab === "my_contributions") {
      getMyDiaryContributions(1)
    }
  }

  useEffect(() => {
    getMyDiaries();
  }, []);

  return (
    <>
      <div className=" flex flex-col-reverse lg:flex-row bg-white mb-6  border-b-1 lg:border-b-2 border-[#D7D8D9]">

        <div className="flex lg:flex-wrap overflow-x-auto lg:overflow-visible scrollbar-custom gap-4 px-2 py-2 lg:mb-2 ">
          {/* My Diaries */}
          <div
            onClick={() => onTabChange('my_diaries')}
            className="cursor-pointer min-w-max items-center justify-center"
          >
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'my_diaries' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              My Diaries
            </p>
            {activeTab === 'my_diaries' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
          {/* Invited Private Diaries */}
          <div
            onClick={() => onTabChange('invited_private_diaries')}
            className="cursor-pointer min-w-max"
          >
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'invited_private_diaries' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              Invited Private Diaries
            </p>
            {activeTab === 'invited_private_diaries' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
          {/* Invited Group Diaries */}
          <div
            onClick={() => onTabChange('invited_group_diaries')}
            className="cursor-pointer min-w-max"
          >
            {/* <p className={`${activeTab === 'invited_group_diaries' ? 'text-[#000]' : 'text-[#000]/60'} font-medium text-[16px]`}> */}
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'invited_group_diaries' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              Invited Group Diaries
            </p>
            {activeTab === 'invited_group_diaries' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
          {/* Subscription Diaries */}
          <div
            onClick={() => onTabChange('subscription_diaries')}
            className="cursor-pointer min-w-max"
          >
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'subscription_diaries' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              Subscription Diaries
            </p>
            {activeTab === 'subscription_diaries' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
          {/* Followed Diaries */}
          <div
            onClick={() => onTabChange('followed_diaries')}
            className="cursor-pointer min-w-max"
          >
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'followed_diaries' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              Followed Diaries
            </p>
            {activeTab === 'followed_diaries' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
          <div
            onClick={() => onTabChange('my_contributions')}
            className="cursor-pointer min-w-max"
          >
            <p className={`px-4 lg:px-0 py-1 lg:py-0 rounded-full lg:rounded-none ${activeTab === 'my_contributions' ? 'bg-[#044093] lg:bg-[#fff] text-[#fff] lg:text-[#000] ' : 'text-[#000]/60 bg-[#f1f5f9] lg:bg-[#fff]'} font-medium text-[14px] lg:text-[16px]`}>
              My Contribution
            </p>
            {activeTab === 'my_contributions' ? (
              <div className="hidden lg:flex h-[2.5px] bg-[#044093] rounded-full w-full mt-1 -mb-[2.8px]" />
            ) : (
              <div className="hidden lg:flex h-[0.09rem] bg-transparent rounded-full w-full mt-1 -mb-[2.8px]" />
            )}
          </div>
        </div>
        {/* Add Diary Button */}
        <Button className="!bg-[#044093] !h-8 text-white !px-4 !py-0 rounded flex items-center justify-center gap-1 ml-auto min-w-max text-[14px] 2xl:text-[16px] mb-2">
          <IconCirclePlus size={18} color='#fff' strokeWidth={1.5} /> <a href="/myaccount/diary/add">Add Diary</a>
        </Button>
      </div>

      {
        activeTab === "my_diaries" &&
        <>
          {
            isLoadingEffect === false ? (
              diariesData.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {diariesData.map((post, index) => (
                    <Diarycard
                      key={index}
                      href={`/myaccount/diary/${post.name}?uid=${post.uuid}&page_no=${post?.diarycontent?.page_no || 1}`}
                      posterimage={post?.diarycontent?.content_image || post.featured_image_url}
                      authorname={post.author_name}
                      authorimage={post.author_image || avatar}
                      title={post.name}
                      posteddate={post.created_at}
                      description={post?.diarycontent?.content ? post.diarycontent.content : null}
                      diary_type={post.diary_type}
                      likes={post.diary_like_count || 0}
                      diary_view_count={post?.diarycontent?.view_count ? post.diarycontent?.view_count : null}
                      diary_share_count={post?.diarycontent?.share_count ? post.diarycontent?.share_count : null}
                      diary_comment_count={post?.diarycontent?.comment_count ? post.diarycontent?.comment_count : null}
                    />
                  ))}
                </div>
                :
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[80%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
            )
              :
              <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                  {[...Array(8)].map((_, i) => (
                    <DiaryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
          }

          {offset < totalCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => getMyDiaries(offset, true)}
                className="px-6 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
                disabled={isLoadingEffect}
              >
                {isLoadingEffect ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      }
      {
        activeTab === "invited_private_diaries" &&
        <>
          {
            invitationLoading === false ? (
              invitedDiaries.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {invitedDiaries.map((post, index) => (
                    <Diarycard
                      key={index}
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
                  ))}
                </div>
                :
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[80%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
            )
              :
              <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <DiaryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
          }

          {invitedOffset < invitedTotalCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => getInvitedDiaries(invitedOffset, true)}
                className="px-6 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
                disabled={invitationLoading}
              >
                {invitationLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      }
      {
        activeTab === "invited_group_diaries" &&
        <>
          {
            groupInvitationLoading === false ? (
              groupInvitedDiaries.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupInvitedDiaries.map((post, index) => (
                    <Diarycard
                      key={index}
                      href={`/myaccount/diary/${post.name}?uid=${post.uuid}&page_no=${post?.diarycontent?.page_no || 1}`}
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
                  ))}
                </div>
                :
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[80%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
            )
              :
              <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <DiaryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
          }

          {groupInvitedOffset < groupInvitedTotalCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => getGroupInvitedDiaries(groupInvitedOffset, true)}
                className="px-6 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
                disabled={groupInvitationLoading}
              >
                {groupInvitationLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      }
      {
        activeTab === "subscription_diaries" &&
        <>
          {
            subscribedLoading === false ? (
              subscriptionDiaries.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subscriptionDiaries.map((diary, index) => (
                    <Diarycard
                      key={index}
                      href={`/diarydetails/${diary.uuid}/${diary?.diarycontent?.page_no || 1}`}
                      posterimage={diary?.diarycontent?.content_image || diary.featured_image_url}
                      authorname={diary.author_name}
                      authorimage={diary.author_image || avatar}
                      title={diary.name}
                      posteddate={diary.created_at}
                      description={diary?.diarycontent?.content ? diary.diarycontent.content : null}
                      likes={diary.diary_like_count || 0}
                      diary_view_count={diary?.diarycontent?.view_count ? diary.diarycontent?.view_count : null}
                      diary_share_count={diary?.diarycontent?.share_count ? diary.diarycontent?.share_count : null}
                      diary_comment_count={diary?.diarycontent?.comment_count ? diary.diarycontent?.comment_count : null}
                    />
                  ))}
                </div>
                :
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[80%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
            )
              :
              <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <DiaryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
          }

          {subscriptionDiariesOffset < subscriptionDiariesTotalCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => getSubscribedDiaries(subscriptionDiariesOffset, true)}
                className="px-6 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
                disabled={subscribedLoading}
              >
                {subscribedLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      }
      {
        activeTab === "followed_diaries" &&
        <>
          {
            followedDiriesLoading === false ? (
              followedDiaries.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {followedDiaries.map((diary, index) => (
                    <Diarycard
                      key={index}
                      href={`/diarydetails/${diary.uuid}/${diary?.diarycontent?.page_no || 1}`}
                      posterimage={diary?.diarycontent?.content_image || diary.featured_image_url}
                      authorname={diary.author_name}
                      authorimage={diary.author_image || avatar}
                      title={diary.name}
                      posteddate={diary.created_at}
                      description={diary?.diarycontent?.content ? diary.diarycontent.content : null}
                      likes={diary.diary_like_count || 0}
                      diary_view_count={diary?.diarycontent?.view_count ? diary.diarycontent?.view_count : null}
                      diary_share_count={diary?.diarycontent?.share_count ? diary.diarycontent?.share_count : null}
                      diary_comment_count={diary?.diarycontent?.comment_count ? diary.diarycontent?.comment_count : null}
                    />
                  ))}
                </div>
                :
                <div className="col-span-12 flex flex-row justify-center items-center ">
                  <div className='w-[80%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
                    <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Diaries Found</p>
                  </div>
                </div>
            )
              :
              <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <DiaryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
          }

          {followedDiariesOffset < followedDiariesTotalCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => getFollowedDiaries(followedDiariesOffset, true)}
                className="px-6 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-blue-700"
                disabled={followedDiriesLoading}
              >
                {followedDiriesLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      }
      {
        activeTab === "my_contributions" &&
        <>
          <div className="w-full font-bold bg-[#fbfbfb] px-4 sm:px-6 md:px-8 lg:px-10 py-3 h-[calc(100vh-130px)] overflow-y-auto">
            <div className="w-full relative overflow-x-auto shadow-[0px_0px_3px_rgba(0,0,0,0.1)] bg-white rounded-[5px] p-2 mt-2">
              <table className="w-full text-left border-collapse">
                <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                        Diary Ref UID
                      </p>
                    </th>
                    <th scope="col" className="px-4 py-2">
                      <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                        Diary Name
                      </p>
                    </th>
                    <th scope="col" className="px-4 py-2">
                      <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                        Status
                      </p>
                    </th>
                    <th scope="col" className="px-4 py-2 sticky_column_last">
                      <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-[16px] font-[500] leading-[18px]'>
                        Action
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    myContributionsLoading === false ?
                      myContributions.length > 0 ?
                        myContributions.map((contribution, index) => (
                          <tr key={index} className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                            <td className="px-4 py-2 truncate">
                              <p className='text-[#2B2B2B] text-[11px] 2xl:text-[13px] 4xl:text-[15px] font-semibold leading-[18px]'>
                                {contribution?.uuid || 'N/A'}
                              </p>
                            </td>
                            <td className="px-4 py-2">
                              <p className='text-[#2B2B2B] text-[11px] 2xl:text-[13px] 4xl:text-[15px] font-semibold leading-[18px]'>
                                {contribution?.name || 'N/A'}
                              </p>
                            </td>
                            <td className="px-4 py-2 truncate">
                              <div
                                className={`flex justify-center items-center gap-1.5 px-5 py-1 rounded-2xl ${contribution.status === "Pending"
                                  ? "bg-[#f8f8f8]"
                                  : contribution.status === "Published"
                                    ? "bg-[#ecfdf3]"
                                    : "bg-[#fdecec]"
                                  } w-fit`}
                              >
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="4.5"
                                    cy="4"
                                    r="3"
                                    fill={
                                      contribution.status === "Pending"
                                        ? `#6a7282`
                                        : contribution.status === "Published"
                                          ? `#14BA6D`
                                          : `#EC0606`
                                    }
                                  />
                                </svg>
                                <p
                                  className={`text-xs 2xl:text-[13px] 4xl:text-[15px] font-medium ${contribution.status === "Pending"
                                    ? "text-gray-500"
                                    : contribution.status === "Published"
                                      ? "text-[#037847]"
                                      : "text-[#ec0606]"
                                    }`}
                                >
                                  {contribution.status === "Pending"
                                    ? "Pending"
                                    : contribution.status === "Published"
                                      ? "Published"
                                      : "Rejected"}
                                </p>
                              </div>
                            </td>
                            <td className='text-center flex gap-x-3 sticky_column_last px-4 py-2'>
                              <IconEye onClick={() => openReviewContent(contribution)} className="cursor-pointer" />
                              {contribution.status === "Pending" &&
                                <IconEdit onClick={() => openEditContent(contribution)} className="cursor-pointer" />
                              }
                            </td>
                          </tr>
                        ))
                        :
                        <tr>
                          <td colSpan={4} className='text-center py-4'>
                            <p className='text-[#4A4D53CC] text-[14px] 4xl:text-[16px] not-italic font-[400] leading-[18px]'>
                              No data found
                            </p>
                          </td>
                        </tr>
                      :
                      <TableLoadingEffect colspan={4} tr={10} />
                  }
                </tbody>
              </table>
            </div>
            {myContributions.length > 0 &&
              <div className="mt-[15px] w-full flex justify-end">
                <Pagination
                  color="#044093"
                  totalpages={myContributionsTotalCount}
                  value={page}
                  onChange={onpagechange}
                  activePageClass="bg-[#E72D65] text-white"
                />
              </div>
            }
          </div>
          <Drawer
            padding="5%"
            size={"50%"}
            position="right"
            zIndex={25}
            overlayProps={{ backgroundOpacity: 0.2 }}
            bg={"transparent"}
            open={isEditContentDrawer}
            onClose={closeEditContent}
            withCloseButton={false}
          >
            {isEditContentDrawer && (
              <Editcontributedcontent
                closeEditDiarypage={closeEditContent}
                pageid={singleContribution?.id}
                diaryContent={singleContribution?.content}
                refreshData={refreshMyContributions}
              />
            )}
          </Drawer>
          <Drawer
            padding="5%"
            size={"50%"}
            position="right"
            zIndex={25}
            overlayProps={{ backgroundOpacity: 0.2 }}
            bg={"transparent"}
            open={isContentDrawer}
            onClose={closeReviewContent}
            withCloseButton={false}
          >
            {isContentDrawer && (
              <Card padding="0px">
                <Card.Section className="fixed w-full flex justify-between items-center h-[50px]">
                  <p className="text-[14px] md:text-[18px] text-[#044093] font-semibold">View Contribution</p>
                  <button
                    onClick={closeReviewContent}
                    className="cursor-pointer p-0 text-[#044093] bg-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                        stroke="#2B2B2B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Card.Section>
                <Card.Section className="p-0 top-[50px] fixed w-full h-[calc(100vh-60px)]">
                  {singleContribution?.content !== "<p></p>" ?
                    <div
                      className="h-fit space-y-6 font-medium text-[#2B2B2B] text-justify text-[14px] leading-[24px] text-wrap 2xl:text-[20px]"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: singleContribution?.content }}
                    ></div>
                    :
                    <p className="font-bold text-[14px] items-center justify-center text-center flex h-full">No content added</p>
                  }
                </Card.Section>
              </Card>
            )}
          </Drawer>
        </>
      }
      {errorMessage && <Errorpanel errorMessages={errorMessage} />}
    </>
  );
}

export default Diarywrapper;
