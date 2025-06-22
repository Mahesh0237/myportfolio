"use client";
import Diariesapi from "@/components/api/Diariesapi";
import Errorpanel from "@/components/shared/Errorpanel";
import InvitationalModal from "@/components/shared/InvitationalModal";
import TableLoadingEffect from "@/components/shared/Tableloadingeffect";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { Button, Card, Drawer, Pagination } from "@nayeshdaggula/tailify";
import { IconEye } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function Contributionwrapper({ user_uid }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const access_token = useUserDetails((state) => state.access_token);
    const user_id = userInfo?.user_id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [diaryContributions, setDiaryContributions] = useState([]);
    const [diaryPageId, setDiaryPageId] = useState("");
    const [page, setPage] = useState(1);
    const [totalpages, setTotalpages] = useState(1);

    const onpagechange = (page) => {
        setPage(page);
        getDiaryContributions(page);
    };

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

    const [openAcceptModal, setopenAcceptModal] = useState(false);
    const openAcceptContributionModal = (id) => {
        setDiaryPageId(id);
        setopenAcceptModal(true);
    };

    const closeAcceptContributionModal = () => {
        setDiaryPageId(null);
        setopenAcceptModal(false);
        closeReviewContent();
    };

    const [openRejectModal, setOpenRejectModal] = useState(false);
    const openRejectContributionModal = (uuid) => {
        setDiaryPageId(uuid);
        setOpenRejectModal(true);
    };
    const closeRejectContributionModal = () => {
        setDiaryPageId(null);
        setOpenRejectModal(false);
        closeReviewContent();
    };

    const getDiaryContributions = (newPage) => {
        setIsLoadingEffect(true);
        Diariesapi.get("getdiarycontributiondetails", {
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
                    setIsLoadingEffect(false);
                    return false;
                }
                setErrorMessage("");
                setTotalpages(data?.totalpages);
                setDiaryContributions(data?.alldiarycontributions || []);
                setIsLoadingEffect(false);
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
                setIsLoadingEffect(false);
                return false;
            });
    };

    const refreshDiaryContributions = () => {
        getDiaryContributions(1);
    };

    useEffect(() => {
        if (user_id) {
            getDiaryContributions(1);
        }
    }, [user_id]);

    return (
        <>
            <div className="w-full font-bold bg-[#fbfbfb] px-4 sm:px-6 md:px-8 lg:px-10 py-3 h-[calc(100vh-130px)] overflow-y-auto">
                <div className="w-full relative overflow-x-auto shadow-[0px_0px_3px_rgba(0,0,0,0.1)] bg-white rounded-[5px] p-2 mt-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                            <tr>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-text-[16px] font-[500] leading-[18px]'>
                                        Diary Ref UID
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-text-[16px] font-[500] leading-[18px]'>
                                        Diary Name
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-text-[16px] font-[500] leading-[18px]'>
                                        Contributed By
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-text-[16px] font-[500] leading-[18px]'>
                                        Status
                                    </p>
                                </th>
                                <th scope="col" className="px-4 py-2 sticky_column_last">
                                    <p className='text-[#999] text-[12px] 2xl:text-[14px] 4xl:text-text-[16px] font-[500] leading-[18px]'>
                                        Action
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoadingEffect === false ?
                                    diaryContributions.length > 0 ?
                                        diaryContributions.map((contribution, index) => (
                                            <tr key={index} className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                                                <td className="px-4 py-2 truncate">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[13px] 4xl:text-text-[15px] font-semibold leading-[18px]'>
                                                        {contribution?.uuid || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[13px] 4xl:text-text-[15px] font-semibold leading-[18px]'>
                                                        {contribution?.name || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2 truncate">
                                                    <p className='text-[#2B2B2B] text-[11px] 2xl:text-[13px] 4xl:text-text-[15px] font-semibold leading-[18px]'>
                                                        {contribution?.contributed_by || 'N/A'}
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
                                                            className={`text-xs 2xl:text-[13px] 4xl:text-text-[15px] font-medium ${contribution.status === "Pending"
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
                                                <td className='text-center sticky_column_last px-4 py-2'>
                                                    <IconEye onClick={() => openReviewContent(contribution)} className="cursor-pointer" />
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={5} className='text-center py-4'>
                                                <p className='text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]'>
                                                    No Requests found
                                                </p>
                                            </td>
                                        </tr>
                                    :
                                    <TableLoadingEffect colspan={5} tr={10} />
                            }
                        </tbody>
                    </table>
                </div>
                {diaryContributions.length > 0 &&
                    <div className="mt-[15px] w-full flex justify-end">
                        <Pagination
                            color="#044093"
                            totalpages={totalpages}
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
                open={isContentDrawer}
                onClose={closeReviewContent}
                withCloseButton={false}
            >
                {isContentDrawer && (
                    <Card padding="0px">
                        <Card.Section className="fixed w-full flex justify-between items-center h-[50px]">
                            <p className="text-[18px] 2xl:text-[16px] text-[#044093] font-semibold">Review Contribution</p>
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
                        <Card.Section className="p-0 top-[50px] fixed w-full h-[calc(100vh-110px)]">
                            {singleContribution?.content !== "<p></p>" ?
                                <div
                                    className="h-fit space-y-6 font-medium text-[#2B2B2B] text-justify text-[12px] xl:text-[14px] leading-[24px] text-wrap 2xl:text-[14px]"
                                    style={{ fontFamily: 'Roboto, sans-serif' }}
                                    dangerouslySetInnerHTML={{ __html: singleContribution?.content }}
                                ></div>
                                :
                                <p className="font-bold text-[14px] items-center justify-center text-center flex h-full">No content added</p>
                            }
                        </Card.Section>
                        <Card.Section className="flex fixed bottom-0 flex-row items-center justify-end gap-6 w-full">
                            <Button
                                onClick={() =>
                                    openRejectContributionModal(singleContribution?.id)
                                }
                                className="!bg-[#EF4444] hover:!bg-[#DC2626] !text-white !px-4 !py-1.5 !rounded-md !text-[14px]"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() =>
                                    openAcceptContributionModal(singleContribution?.id)
                                }
                                className="!bg-[#22C55E] hover:!bg-[#16A34A] !text-white !px-4 !py-1.5 !rounded-md !text-[14px]"
                            >
                                Publish
                            </Button>
                        </Card.Section>
                    </Card>
                )}
            </Drawer>

            <InvitationalModal
                title="Publish Contribution"
                message="Are you sure you want to Publish this Contribution?"
                open={openAcceptModal}
                onClose={closeAcceptContributionModal}
                onConfirm={() => {
                    setIsLoadingEffect(true);
                    Diariesapi.post("/contributionstatusupdate", {
                        diarypage_id: diaryPageId,
                        status: "Published",
                    })
                        .then((res) => {
                            const data = res.data;
                            if (data.status === "error") {
                                const finalResponse = {
                                    status: "error",
                                    message: data.message,
                                };
                                setErrorMessage(finalResponse);
                                setDiaryPageId("");
                                closeAcceptContributionModal();
                                setIsLoadingEffect(false);
                                return false;
                            }
                            setErrorMessage("");
                            refreshDiaryContributions();
                            setDiaryPageId("");
                            closeAcceptContributionModal();
                            setIsLoadingEffect(false);
                            return false;
                        })
                        .catch((error) => {
                            const finalResponse = {
                                status: "error",
                                message: error.message,
                            };
                            setErrorMessage(finalResponse);
                            setDiaryPageId("");
                            closeAcceptContributionModal();
                            setIsLoadingEffect(false);
                            return false;
                        });
                }}
            />
            <InvitationalModal
                title="Reject Contribution"
                message="Are you sure you want to reject this contribution?"
                open={openRejectModal}
                confirmColor="red-500"
                confirmColorHover="red-700"
                onClose={closeRejectContributionModal}
                onConfirm={() => {
                    setIsLoadingEffect(true);
                    Diariesapi.post("/contributionstatusupdate", {
                        diarypage_id: diaryPageId,
                        status: "Rejected",
                    })
                        .then((res) => {
                            const data = res.data;
                            if (data.status === "error") {
                                const finalResponse = {
                                    status: "error",
                                    message: data.message,
                                };
                                setErrorMessage(finalResponse);
                                setDiaryPageId("");
                                closeRejectContributionModal();
                                setIsLoadingEffect(false);
                                return false;
                            }
                            setErrorMessage("");
                            setDiaryPageId("");
                            closeRejectContributionModal();
                            refreshDiaryContributions();
                            setIsLoadingEffect(false);
                            return false;
                        })
                        .catch((error) => {
                            const finalResponse = {
                                status: "error",
                                message: error.message,
                            };
                            setErrorMessage(finalResponse);
                            setDiaryPageId("");
                            closeRejectContributionModal();
                            setIsLoadingEffect(false);
                            return false;
                        });
                }}
            />
            {/* {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} overlayBg='#2b2b2bcc' />} */}
            {errorMessage && <Errorpanel errorMessages={errorMessage} />}
        </>
    );
}

export default Contributionwrapper;