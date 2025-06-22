"use client";
import Diariesapi from "@/components/api/Diariesapi";
import Errorpanel from "@/components/shared/Errorpanel";
import InvitationalModal from "@/components/shared/InvitationalModal";
import TableLoadingEffect from "@/components/shared/Tableloadingeffect";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { Button, Pagination } from "@nayeshdaggula/tailify";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Invitationswrapper({ user_uid }) {
  const userInfo = useUserDetails((state) => state.user_info);
  const access_token = useUserDetails((state) => state.access_token);
  const user_id = userInfo?.user_id || null;
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [diaryInvitations, setdiaryInvitations] = useState([]);
  const [diaryUuid, setDiaryUuid] = useState("");
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);

  const onpagechange = (page) => {
    setPage(page);
    getDiaryInvitations(page);
  };

  const [openAcceptModal, setopenAcceptModal] = useState(false);
  const openAcceptInvitationalModal = (uuid) => {
    setDiaryUuid(uuid);
    setopenAcceptModal(true);
  };

  const closeAcceptInvitationalModal = () => {
    setDiaryUuid(null);
    setopenAcceptModal(false);
  };

  const [openRejectModal, setOpenRejectModal] = useState(false);
  const openRejectInvitationalModal = (uuid) => {
    setDiaryUuid(uuid);
    setOpenRejectModal(true);
  };
  const closeRejectInvitationalModal = () => {
    setDiaryUuid(null);
    setOpenRejectModal(false);
  };

  const getDiaryInvitations = (newPage) => {
    setIsLoadingEffect(true);
    Diariesapi.get("getdiaryinvitationdetails", {
      params: {
        user_id: user_id,
        page: newPage,
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
        setdiaryInvitations(data?.alldiaryinvitations || []);
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

  const refreshDiaryInvitations = () => {
    getDiaryInvitations(1);
  };

  useEffect(() => {
    if (user_id) {
      getDiaryInvitations(1);
    }
  }, [user_id]);

  return (
    <>
      <div className="w-full py-[2vw] font-bold h-fit overflow-y-auto">
        <p className="text-[20px] 3xl:text-[22px] font-semibold text-[#0348AD]">
          Diary Invitations
        </p>
        <div className='shadow-[0px_0px_3px_rgba(0,0,0,0.1)] bg-white rounded-[5px] p-2 mt-2'>
          <div className="w-full relative overflow-x-auto rounded-[4px]">
            <table className="w-full text-left border-collapse">
              <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    <p className='text-[#999] text-[12px] 3xl:text-[14px] font-[500] leading-[18px]'>
                      Diary Ref UID
                    </p>
                  </th>
                  <th scope="col" className="px-4 py-2">
                    <p className='text-[#999] text-[12px]  3xl:text-[14px] font-[500] leading-[18px]'>
                      Diary Name
                    </p>
                  </th>
                  <th scope="col" className="px-4 py-2">
                    <p className='text-[#999] text-[12px]  3xl:text-[14px] font-[500] leading-[18px]'>
                      Invited By
                    </p>
                  </th>
                  <th scope="col" className="px-4 py-2">
                    <p className='text-[#999] text-[12px]  3xl:text-[14px] font-[500] leading-[18px]'>
                      Status
                    </p>
                  </th>
                  <th scope="col" className="px-4 py-2 sticky_column_last">
                    <p className='text-[#999] text-[12px]  3xl:text-[14px] font-[500] leading-[18px]'>
                      Action
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  isLoadingEffect === false ?
                    diaryInvitations.length > 0 ?
                      diaryInvitations.map((invitations, index) => (
                        <tr key={index} className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                          <td className="px-4 py-2 truncate">
                            <p className='text-[#2B2B2B] text-[11px] 3xl:text-[13px] font-semibold leading-[18px]'>
                              {invitations?.uuid || 'N/A'}
                            </p>
                          </td>
                          <td className="px-4 py-2">
                            <p className='text-[#2B2B2B] text-[11px] 3xl:text-[13px] font-semibold leading-[18px]'>
                              {invitations?.name || 'N/A'}
                            </p>
                          </td>
                          <td className="px-4 py-2 truncate">
                            <p className='text-[#2B2B2B] text-[11px] 3xl:text-[13px] font-semibold leading-[18px]'>
                              {invitations?.sender_name || 'N/A'}
                            </p>
                          </td>
                          <td className="px-4 py-2 truncate">
                            <div
                              className={`flex justify-center items-center gap-1.5 px-5 py-1 rounded-2xl ${invitations.status === "Pending"
                                ? "bg-[#f8f8f8]"
                                : invitations.status === "Accepted"
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
                                    invitations.status === "Pending"
                                      ? `#6a7282`
                                      : invitations.status === "Accepted"
                                        ? `#14BA6D`
                                        : `#EC0606`
                                  }
                                />
                              </svg>
                              <p
                                className={`text-xs font-medium ${invitations.status === "Pending"
                                  ? "text-gray-500"
                                  : invitations.status === "Accepted"
                                    ? "text-[#037847]"
                                    : "text-[#ec0606]"
                                  }`}
                              >
                                {invitations.status === "Pending"
                                  ? "Pending"
                                  : invitations.status === "Accepted"
                                    ? "Accepted"
                                    : "Rejected"}
                              </p>
                            </div>
                          </td>
                          <td className='text-center sticky_column_last'>
                            {invitations.status === "Pending" ? (
                              <div className="flex flex-row items-center gap-2">
                                <Button
                                  onClick={() =>
                                    openAcceptInvitationalModal(invitations?.invitation_uuid)
                                  }
                                  className="!bg-[#22C55E] hover:!bg-[#16A34A] !text-white !px-3 !py-1 !rounded-md !text-[12px]"
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() =>
                                    openRejectInvitationalModal(invitations?.invitation_uuid)
                                  }
                                  className="!bg-[#EF4444] hover:!bg-[#DC2626] !text-white !px-3 !py-1 !rounded-md !text-[12px]"
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : invitations.status === "Accepted" ? (
                              <Link href={`/diarydetails/${invitations.uuid}`}>
                                <IconEye className="text-[#2b2b2bcc] cursor-pointer" />
                              </Link>
                            ) : (
                              "----"
                            )}
                          </td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td colSpan={4} className='text-center py-4'>
                          <p className='text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]'>
                            No data found
                          </p>
                        </td>
                      </tr>
                    :
                    <TableLoadingEffect colspan={4} tr={4} />
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-[15px] w-full flex justify-end">
          <Pagination
            color="#044093"
            totalpages={totalpages}
            value={page}
            onChange={onpagechange}
            activePageClass="bg-[#E72D65] text-white"
          />
        </div>
        <InvitationalModal
          title="Accept Invitation"
          message="Are you sure you want to accept this invitation?"
          open={openAcceptModal}
          onClose={closeAcceptInvitationalModal}
          onConfirm={() => {
            setIsLoadingEffect(true);
            Diariesapi.post("/invitationstatusupdate", {
              diary_uuid: diaryUuid,
              receiver_uid: user_uid,
              status: "Accepted",
            })
              .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                  const finalResponse = {
                    status: "error",
                    message: data.message,
                  };
                  setErrorMessage(finalResponse);
                  setDiaryUuid("");
                  closeAcceptInvitationalModal();
                  setIsLoadingEffect(false);
                  return false;
                }
                setErrorMessage("");
                refreshDiaryInvitations();
                setDiaryUuid("");
                closeAcceptInvitationalModal();
                setIsLoadingEffect(false);
                return false;
              })
              .catch((error) => {
                const finalResponse = {
                  status: "error",
                  message: error.message,
                };
                setErrorMessage(finalResponse);
                setDiaryUuid("");
                closeAcceptInvitationalModal();
                setIsLoadingEffect(false);
                return false;
              });
          }}
        />
        <InvitationalModal
          title="Reject Invitation"
          message="Are you sure you want to reject this invitation?"
          open={openRejectModal}
          onClose={closeRejectInvitationalModal}
          onConfirm={() => {
            setIsLoadingEffect(true);
            Diariesapi.post("/invitationstatusupdate", {
              diary_uuid: diaryUuid,
              receiver_uid: user_uid,
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
                  setDiaryUuid("");
                  closeRejectInvitationalModal();
                  setIsLoadingEffect(false);
                  return false;
                }
                setErrorMessage("");
                setDiaryUuid("");
                refreshDiaryInvitations();
                closeRejectInvitationalModal();
                setIsLoadingEffect(false);
                return false;
              })
              .catch((error) => {
                const finalResponse = {
                  status: "error",
                  message: error.message,
                };
                setErrorMessage(finalResponse);
                setDiaryUuid("");
                closeRejectInvitationalModal();
                setIsLoadingEffect(false);
                return false;
              });
          }}
        />
      </div>
      {/* {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} overlayBg='#2b2b2bcc' />} */}
      {errorMessage && <Errorpanel errorMessages={errorMessage} />}
    </>
  );
}

export default Invitationswrapper;
