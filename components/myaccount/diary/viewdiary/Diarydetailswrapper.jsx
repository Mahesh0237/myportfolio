"use client";
import React, { useCallback, useEffect, useState } from "react";
import config from "@/config";
import Diarycontentdetails from "./Diarycontentdetails";
import Comments from "./Comments";
import Editdiary from "../Editdiary";
import Diarygroupmembers from "./Diarygroupmembers";
import Diariesapi from "@/components/api/Diariesapi";
import CropImage from "@/components/shared/CropImage";
import Errorpanel from "@/components/shared/Errorpanel";
import DeleteModal from "@/components/shared/DeleteModal";
import Diaryinvitationmodal from "./Diaryinvitationmodal";
import Sharediarybylinkmodal from "./Sharediarybylinkmodal";
import Invitationmodaltogroupmember from "./parts/Invitationmodaltogroupmember";
import Sharediarybylinkmodaltogroupmember from "./parts/Sharediarybylinkmodaltogroupmember";
import { toast } from "react-toastify";
import { Button, Modal } from "@nayeshdaggula/tailify";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { IconArrowLeft, IconEdit, IconLink, IconSend, IconShare, IconTrash } from "@tabler/icons-react";

function Diarydetailswrapper({ user_uid, is_logged, diaryname }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const access_token = useUserDetails((state) => state.access_token);
    const user_id = userInfo?.user_id;
    const router = useRouter();
    const params = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [diaryPageDetails, setDiaryPageDetails] = useState({});
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const [editDairymodal, seteditDairymodal] = useState(false);
    //// Responsive conditional
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

    const openEditDairymodal = (id) => {
        seteditDairymodal(true);
    };

    const closeEditdiarymodal = () => {
        seteditDairymodal(false);
    };

    const [featuredImageUrl, setFeaturedImageUrl] = useState("");

    const [croppedImage, setCroppedImage] = useState("");
    const [featuredImageError, setFeaturedImageError] = useState("");
    const updateFeaturedImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCroppedImage(URL.createObjectURL(file));
            setFeaturedImageError("");
        }
    };

    const featuredImageRemove = () => {
        setCroppedImage(null);
        setFeaturedImageUrl("");
        setCroppedImage("");
    };

    const [featureImageModal, setFeatureImageModal] = useState(false);
    const openFeatureImageModal = () => {
        setFeatureImageModal(true);
    };
    const closeFeatureImageModal = () => {
        setFeatureImageModal(false);
        setCroppedImage(null);
    };

    const diary_access_token = params.get("diary_access_token");
    const sender_uid = params.get("sender_uid");

    const [diaryAccessDenied, setDiaryAccessDenied] = useState(null);
    const getSingleViewDairyData = (uidParam, useruid, diaryaccesstoken, senderuid, pageParam = 1) => {
        setIsLoadingEffect(true);
        Diariesapi.get("getmysingledairydata", {
            params: {
                uid: uidParam,
                page_no: pageParam,
                user_uid: useruid,
                diary_access_token: diaryaccesstoken,
                senderUid: senderuid,
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                } else if (data.status === "access_denied") {
                    setDiaryAccessDenied(data);
                    setIsLoadingEffect(false);
                    return false;
                }
                setErrorMessage("");
                setDiaryPageDetails(data?.diaryPageDetails || {});
                setTotalPages(data.totaldiaryPagesCount);
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
                const finalresponse = {
                    status: "error",
                    message: error.message,
                };
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            });
    };

    const uidParam = params.get("uid");

    useEffect(() => {
        getSingleViewDairyData(uidParam, user_uid, diary_access_token, sender_uid);
    }, [uidParam, diary_access_token, sender_uid, user_uid]);

    const refreshSingleViewDairyData = () => {
        getSingleViewDairyData(uidParam, user_uid, diary_access_token, sender_uid);
    };

    const [diaryPageno, setDiaryPageno] = useState(1);
    const updateDiarypageno = useCallback((pgno) => {
        setDiaryPageno(pgno);
    }, []);

    const [allComments, setAllComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    const getDairyComments = async (diaryid) => {
        setCommentsLoading(true);
        Diariesapi.get("getdiarycomments", {
            params: {
                diary_id: diaryid,
                diarypage_no: diaryPageno,
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => {
                let data = res.data;
                if (data.status == "error") {
                    const finalrresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalrresponse);
                    setCommentsLoading(false);
                    return false;
                }
                setCommentsLoading(false);
                setAllComments(data?.comments || []);
                setCommentCount(data?.commentCount || 0);
                return false;
            })
            .catch((error) => {
                console.log("Error:", error);
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
                setCommentsLoading(false);
                return false;
            });
    };

    const [diaryGroupMembres, setDiaryGroupMembres] = useState([]);
    const [diaryGroupMembresLoading, setDiaryGroupMembresLoading] = useState(false);
    const getDiaryGroupMembres = async (diaryid) => {
        setDiaryGroupMembresLoading(true);
        Diariesapi.get("getdiarygroupmembers", {
            params: {
                diary_id: diaryid,
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => {
                let data = res.data;
                if (data.status == "error") {
                    const finalrresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalrresponse);
                    setDiaryGroupMembresLoading(false);
                    return false;
                }
                setDiaryGroupMembresLoading(false);
                setDiaryGroupMembres(data?.groupMembers || []);
                return false;
            })
            .catch((error) => {
                console.log("Error:", error);
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
                setDiaryGroupMembresLoading(false);
                return false;
            });
    };

    useEffect(() => {
        if (diaryPageDetails?.id) {
            getDairyComments(diaryPageDetails?.id);
            getDiaryGroupMembres(diaryPageDetails?.id);
        }
    }, [diaryPageDetails?.id, diaryPageno]);

    const refreshComments = () => {
        setCommentsLoading(true);
        getDairyComments(diaryPageDetails?.id);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: "Check out this link!",
                    url: `${config.main_url}/diarydetails/${uidParam}`,
                })
                .catch((error) => console.log("Sharing failed", error));
        } else {
            alert("Share not supported on this browser. Please copy the URL manually.");
        }
    };

    const [diaryInvitation, setDiaryInvitation] = useState(false);
    const openDiaryinvitationModal = () => {
        setDiaryInvitation(true);
    };
    const closeDiaryinvitationModal = () => {
        setDiaryInvitation(false);
    };

    const [sharediarybylinkmodal, setSharediarybylinkmodal] = useState(false);
    const openSharediarybylinkmodal = () => {
        setSharediarybylinkmodal(true);
    };
    const closeSharediarybylinkmodal = () => {
        setSharediarybylinkmodal(false);
    };

    const [diaryInvitationtoGroup, setDiaryInvitationtoGroup] = useState(false);
    const openDiaryinvitationModaltoGroup = () => {
        setDiaryInvitationtoGroup(true);
    };
    const closeDiaryinvitationModaltoGroup = () => {
        setDiaryInvitationtoGroup(false);
    };

    const [sharediarybylinkmodaltoGroup, setSharediarybylinkmodaltoGroup] = useState(false);
    const openSharediarybylinkmodaltoGroup = () => {
        setSharediarybylinkmodaltoGroup(true);
    };
    const closeSharediarybylinkmodaltoGroup = () => {
        setSharediarybylinkmodaltoGroup(false);
    };

    const [deleteDiaryModal, setDeleteDiaryModal] = useState(false);
    const openDeleteDiaryModal = () => {
        setDeleteDiaryModal(true);
    };
    const closeDeleteDiaryModal = () => {
        setDeleteDiaryModal(false);
    };

    const handleDeleteDiary = () => {
        setIsLoadingEffect(true);
        Diariesapi.post("deletediary", {
            diary_uid: uidParam,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === "error") {
                    let finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data.message);
                setIsLoadingEffect(false);
                router.push("/myaccount/diary");
                return false;
            })
            .catch((error) => {
                console.log(error.message);
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
                setIsLoadingEffect(false);
                return false;
            });
    };

    const [isAcceptRejectLoading, setIsAcceptRejectLoading] = useState(false);
    const handleAcceptRejectInvitation = (stus) => {
        Diariesapi.post(
            "acceptrejectdiaryinvitation",
            {
                diary_uid: uidParam,
                sender_uid: sender_uid,
                receiver_uid: user_uid,
                status: stus,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalresponse);
                    setIsAcceptRejectLoading(false);
                    return false;
                }
                setIsAcceptRejectLoading(false);
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                if (data.inviationStatus === "Accepted") {
                    getSingleViewDairyData(uidParam, user_uid, diary_access_token, sender_uid);
                    setDiaryAccessDenied(null);
                    // router.push(`/diary/${diaryname}?uid=${uidParam}`);
                } else if (data.inviationStatus === "Rejected") {
                    router.push("/myaccount/diary");
                }
                return false;
            })
            .catch((error) => {
                console.log(error);
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
                setIsAcceptRejectLoading(false);
                return false;
            });
    };

    const handleLogin = () => {
        let redirectPath;
        if (diary_access_token) {
            redirectPath = `/myaccount/diary/${diaryname}?uid=${uidParam}&diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        } else {
            redirectPath = `/myaccount/diary/${diaryname}?uid=${uidParam}`;
        }
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    };

    const handleRegister = () => {
        // const redirectPath = `/diarydetails/${diaryuid}?diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        let redirectPath;
        if (diary_access_token) {
            redirectPath = `//myaccount/diary/${diaryname}?uid=${uidParam}&diary_access_token=${diary_access_token}&sender_uid=${sender_uid}`;
        } else {
            redirectPath = `/myaccount/diary/${diaryname}?uid=${uidParam}`;
        }
        router.push(`/register?redirect=${encodeURIComponent(redirectPath)}`);
    };

    return (
        <>
            {diaryAccessDenied !== null ? (
                <>
                    {diaryAccessDenied?.error === "access_denied" ? (
                        <div className="flex flex-row justify-center items-center ">
                            <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                                <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">{diaryAccessDenied?.message}</p>
                            </div>
                        </div>
                    ) : diaryAccessDenied?.error === "user_uid_is_required" ? (
                        <div className="flex flex-row justify-center items-center ">
                            <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                <h1 className="text-2xl font-bold text-red-500">User Uid required</h1>
                                <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">Please login or signup to access the diary.</p>
                                <div className="flex flex-row gap-4 mt-4">
                                    <Button className="!bg-[#044093] text-white px-4 py-2 rounded-md" onClick={handleLogin}>
                                        Login
                                    </Button>
                                    <Button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleRegister}>
                                        Sign Up
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : diaryAccessDenied?.error === "user_not_found" ? (
                        <div className="flex flex-row justify-center items-center ">
                            <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                <h1 className="text-2xl font-bold text-red-500">User Not Found</h1>
                                <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">{diaryAccessDenied?.message}</p>
                            </div>
                        </div>
                    ) : diaryAccessDenied?.error === "invalid_token" ? (
                        <div className="flex flex-row justify-center items-center ">
                            <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                <h1 className="text-2xl font-bold text-red-500">Invalid Token</h1>
                                <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">{diaryAccessDenied?.message}</p>
                            </div>
                        </div>
                    ) : diaryAccessDenied?.error === "diary_invitation_pending" ? (
                        <>
                            {is_logged === "true" ? (
                                <div className="relavtive">
                                    <div className="flex flex-row justify-center items-center ">
                                        <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                            <h3 className="text-lg font-bold ">Please accept the Diary invitation to become a Group Member</h3>
                                            <div className="flex flex-row gap-4 mt-4">
                                                <Button className="text-white px-4 py-2 rounded-md" onClick={() => handleAcceptRejectInvitation("Accepted")}>
                                                    Accept
                                                </Button>
                                                <Button className="!bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleAcceptRejectInvitation("Rejected")}>
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {isAcceptRejectLoading && (
                                        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
                                            <Loadingoverlay visible={isAcceptRejectLoading} overlayBg="" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">Please login or signup to access the diary.</p>
                                    <div className="flex flex-row gap-4 mt-4">
                                        <Button className="!bg-[#044093] text-white px-4 py-2 rounded-md" onClick={handleLogin}>
                                            Login
                                        </Button>
                                        <Button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleRegister}>
                                            Sign Up
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        diaryAccessDenied?.error === "diary_invitation_rejected" && (
                            <div className="flex flex-row justify-center items-center ">
                                <div className="w-[70%] my-12 flex flex-col items-center justify-center h-[250px] bg-[#e6f0ff] border border-[#D7D8D9] rounded-md">
                                    <h1 className="text-2xl font-bold text-red-500">Access Denied invitation rejected</h1>
                                    <p className="text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">{diaryAccessDenied?.message}</p>
                                </div>
                            </div>
                        )
                    )}
                </>
            ) : (
                <>
                    <div className="flex md:flex-row flex-col items-start md:justify-between w-full bg-[#f1f5f9] z-10 px-4 sm:px-6 md:px-8 lg:px-10 md:py-3 md:pt-6 py-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center">
                                <h1 className="text-[20px] font-bold text-[#2b2b2b] leading-3 tracking-[0.5px] 2xl:py-3 2xl:text-[38px]" style={{ fontFamily: "Times New Roman, serif" }}>
                                    {diaryPageDetails?.name}
                                </h1>
                                {diaryPageDetails?.diary_status === "Inactive" ? (
                                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fdecec] w-fit">
                                        <svg width={9} height={8} viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-2 h-2 relative" preserveAspectRatio="xMidYMid meet">
                                            <circle cx="4.42871" cy={4} r={3} fill="#EC0606" />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">Inactive</p>
                                    </div>
                                ) : diaryPageDetails?.diary_status === "Active" ? (
                                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#ecfdf3] w-fit">
                                        <svg width={9} height={8} viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-2 h-2 relative" preserveAspectRatio="xMidYMid meet">
                                            <circle cx="4.42871" cy={4} r={3} fill="#14BA6D" />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">Active</p>
                                    </div>
                                ) : (
                                    diaryPageDetails?.diary_status === "Suspended" && (
                                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#D6D6D6] w-fit">
                                            <svg width={9} height={8} viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-2 h-2 relative" preserveAspectRatio="xMidYMid meet">
                                                <circle cx="4.42871" cy={4} r={3} fill="#434343" />
                                            </svg>
                                            <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">Suspended</p>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                {diaryPageDetails?.diary_type === "Group" ? (
                                    <div className="bg-[#4CAF50]  px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                        <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[600]">
                                            {diaryPageDetails?.diary_type} diary ({diaryPageDetails?.status})
                                        </p>
                                    </div>
                                ) : diaryPageDetails?.diary_type === "Subscription" ? (
                                    <div className="bg-[#673AB7]  px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                        <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[600]">{diaryPageDetails?.diary_type} diary</p>
                                    </div>
                                ) : (
                                    <div className="bg-[#FF9800] px-4 py-1 rounded-md flex flex-row items-center justify-center">
                                        <p className="text-white text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[600]">
                                            {diaryPageDetails?.diary_type} diary ({diaryPageDetails?.status})
                                        </p>
                                    </div>
                                )}
                                <p className="text-[#2b2b2b]/60 text-sm 2xl:pt-2 2xl:text-[22px]">
                                    {new Date(diaryPageDetails?.created_at).toLocaleString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:mt-0 mt-5">
                            {diaryPageDetails?.diary_type === "Group" ? (
                                diaryPageDetails?.author_details?.author_uid === user_uid && (
                                    <>
                                        <Button onClick={openSharediarybylinkmodaltoGroup} variant="default" className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] 2xl:text-[24px] 2xl:px-5">
                                            <IconLink className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                            Share by Link to Group Member
                                        </Button>
                                        <Button onClick={openDiaryinvitationModaltoGroup} variant="default" className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[24px] 2xl:px-5">
                                            <IconSend className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                            Send Invitation to Group Member
                                        </Button>
                                    </>
                                )
                            ) : (
                                <>
                                    {diaryPageDetails?.status === "Private" ? (
                                        //
                                        (diaryPageDetails?.author_details?.author_uid === user_uid || diaryPageDetails?.diary_type === "Group") && (
                                            <>
                                                <Button onClick={openSharediarybylinkmodal} variant="default" className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] 2xl:text-[24px] 2xl:px-5">
                                                    <IconLink className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                                    Share by Link
                                                </Button>
                                                <Button onClick={openDiaryinvitationModal} variant="default" className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[24px] 2xl:px-5">
                                                    <IconSend className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                                    Send Invitation
                                                </Button>
                                            </>
                                        )
                                    ) : (
                                        <Button variant="default" onClick={handleShare} className="flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[24px] 2xl:px-5">
                                            <IconShare className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                            Share
                                        </Button>
                                    )}
                                </>
                            )}
                            {
                                //
                                (diaryPageDetails?.author_details?.author_uid === user_uid || diaryPageDetails?.diary_type === "Group") && (
                                    <Button
                                        onClick={() => {
                                            openEditDairymodal(diaryPageDetails?.id);
                                        }}
                                        className="flex items-center justify-center text-[12px] !bg-[#044093] !rounded-[2px] cursor-pointer 2xl:text-[24px] 2xl:px-5"
                                    >
                                        <IconEdit className="h-4 w-6 2xl:h-6 2xl:w-7" />
                                        Edit
                                    </Button>
                                )
                            }
                            {diaryPageDetails?.author_details?.author_uid === user_uid && (
                                <Button variant="light" onClick={openDeleteDiaryModal} className="flex items-center justify-center text-[12px] !text-[#fff] cursor-pointer !rounded-[6px] !bg-[#B91C1C] 2xl:text-[24px] 2xl:px-5">
                                    <IconTrash className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                    Delete diary
                                </Button>
                            )}
                            <Button onClick={() => router.push("/myaccount/diary")} variant="default" className="flex items-center !rounded-[2px] justify-center text-[12px] !text-[#044093] hover:!text-[#fff] !border-1 !border-[#044093] hover:!bg-[#044093] cursor-pointer 2xl:text-[24px] 2xl:px-5">
                                <IconArrowLeft className="h-4 w-6 2xl:h-6 2xl:w-8" /> Back
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col lg:grid lg:grid-cols-12 px-4 sm:px-6 md:px-8 lg:px-10 w-full z-10 overflow-hidden bg-[#f1f5f9] py-6 gap-4 min-h-[calc(100vh-180px)]">
                        <div className="w-full lg:col-span-8 bg-[#fff] flex flex-col justify-between order-1">
                            <Diarycontentdetails
                                isLoadingEffect={isLoadingEffect}
                                setIsLoadingEffect={setIsLoadingEffect}
                                diary_id={diaryPageDetails?.id}
                                diaryContent={diaryPageDetails?.content}
                                totalPages={totalPages}
                                setTotalPages={setTotalPages}
                                uid={uidParam}
                                refreshSingleViewDairyData={refreshSingleViewDairyData}
                                diaryPageDetails={diaryPageDetails}
                                user_uid={user_uid}
                                updateDiarypageno={updateDiarypageno}
                            />
                        </div>

                        <div className="w-full flex flex-col gap-2 lg:col-span-4  order-2 lg:order-2 lg:sticky ">
                            {
                                diaryPageDetails?.diary_type === "Group" &&
                                <div className="bg-[#fff] p-3">
                                    <Diarygroupmembers
                                        diaryGroupMembres={diaryGroupMembres}
                                        diaryGroupMembresLoading={diaryGroupMembresLoading}
                                        is_logged={is_logged}
                                        user_uid={user_uid}
                                    />
                                </div>
                            }
                            <div className="bg-[#fff] lg:h-[calc(100vh-170px)] lg:overflow-y-auto">
                                <Comments
                                    diary_id={diaryPageDetails?.id}
                                    diaryPageDetails={diaryPageDetails}
                                    user_id={user_id}
                                    access_token={access_token}
                                    allComments={allComments}
                                    setAllComments={setAllComments}
                                    commentsLoading={commentsLoading}
                                    refreshComments={refreshComments}
                                    commentCount={commentCount}
                                    diaryPageno={diaryPageno}
                                    user_uid={user_uid}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Modal
                open={editDairymodal}
                onClose={closeEditdiarymodal}
                size={modalSize}
                zIndex={9999}
                withCloseButton={false}
                containerClassName="relative z-[9999] overflow-y-auto max-h-[80vh]"
                margin="0px"
                padding="0px"
                overlyClassName="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[2px] transition-all duration-300"
            >
                {editDairymodal && (
                    <Editdiary
                        closeEditdiarymodal={closeEditdiarymodal}
                        refreshSingleViewDairyData={refreshSingleViewDairyData}
                        openFeatureImageModal={openFeatureImageModal}
                        closeFeatureImageModal={closeFeatureImageModal}
                        featuredImageUrl={featuredImageUrl}
                        setFeaturedImageUrl={setFeaturedImageUrl}
                        croppedImage={croppedImage}
                        setCroppedImage={setCroppedImage}
                        featuredImageError={featuredImageError}
                        setFeaturedImageError={setFeaturedImageError}
                        updateFeaturedImage={updateFeaturedImage}
                        featuredImageRemove={featuredImageRemove}
                    />
                )}
            </Modal>
            <Modal
                open={diaryInvitation}
                size={modalSize}
                onClose={closeDiaryinvitationModal}
                withCloseButton={false}
                zIndex={1000}
                margin="0px"
                padding="0px"
            >
                {diaryInvitation && (
                    <Diaryinvitationmodal
                        closeDiaryinvitationModal={closeDiaryinvitationModal}
                        diary_id={diaryPageDetails?.id}
                    />
                )}
            </Modal>
            <Modal
                open={sharediarybylinkmodal}
                size={modalSize}
                onClose={closeSharediarybylinkmodal}
                withCloseButton={false}
                zIndex={1000}
                margin="0px"
                padding="0px"
            >
                {sharediarybylinkmodal && (
                    <Sharediarybylinkmodal
                        closeSharediarybylinkmodal={closeSharediarybylinkmodal}
                        diary_id={diaryPageDetails?.id}
                        diary_uid={uidParam}
                        user_uid={user_uid}
                    />
                )}
            </Modal>
            <Modal
                open={diaryInvitationtoGroup}
                size={modalSize}
                onClose={closeDiaryinvitationModaltoGroup}
                withCloseButton={false}
                zIndex={1000}
                margin="0px"
                padding="0px"
            >
                {diaryInvitationtoGroup && (
                    <Invitationmodaltogroupmember
                        closeDiaryinvitationModaltoGroup={closeDiaryinvitationModaltoGroup}
                        diary_id={diaryPageDetails?.id}
                    />
                )}
            </Modal>
            <Modal
                open={sharediarybylinkmodaltoGroup}
                size={modalSize}
                onClose={closeSharediarybylinkmodaltoGroup}
                withCloseButton={false}
                zIndex={1000}
                margin="0px"
                padding="0px"
            >
                {sharediarybylinkmodaltoGroup && (
                    <Sharediarybylinkmodaltogroupmember
                        closeSharediarybylinkmodaltoGroup={closeSharediarybylinkmodaltoGroup}
                        diary_id={diaryPageDetails?.id}
                        diary_name={diaryPageDetails?.name}
                        diary_uid={uidParam}
                        user_uid={user_uid}
                    />
                )}
            </Modal>
            <DeleteModal
                size={modalSize}
                title="Delete Diary"
                message="Are you sure you want to delete this diary?"
                open={deleteDiaryModal}
                onClose={closeDeleteDiaryModal}
                onConfirm={handleDeleteDiary}
            />
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }

            <Modal
                open={featureImageModal}
                size="50%"
                onClose={closeFeatureImageModal}
                withCloseButton={false}
                margin="0px"
                padding="0px"
                zIndex={9999}
            >
                {featureImageModal && (
                    <CropImage image={croppedImage} onClose={closeFeatureImageModal} setCroppedImage={setFeaturedImageUrl} />
                )}
            </Modal>
        </>
    );
}

export default Diarydetailswrapper;
