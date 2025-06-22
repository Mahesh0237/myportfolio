"use client";
import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Editmember from "./Editmember";
import Addnewmember from "./Addnewmember";
import Teamapi from "@/components/api/Teamapi";
import Errorpanel from "@/components/shared/Errorpanel";
import DeleteModal from "@/components/shared/DeleteModal";
import Tableloadingeffect from "@/components/shared/Tableloadingeffect";
import { toast } from "react-toastify";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import CropImage from "@/components/shared/CropImage";

function Teamwrapper() {
  const access_token = useEmployeDetails((state) => state.access_token);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("4");
  const [searchQuery, setSearchQuery] = useState("");
  const [singleuserId, setSingleuserId] = useState("");

  const [addnewmodal, setAddnewmodal] = useState(false);
  const openAddnewmodal = () => {
    setAddnewmodal(true);
  };
  const closeAddnewmodal = () => {
    setAddnewmodal(false);
    setTeamImageUrl('');
  }

  const [editusermodal, setEditusermodal] = useState(false);
  const openEditusermodal = (id, user_details) => {
    setSingleuserId(user_details.uuid);
    setEditusermodal(true);
  };

  const closeEditusermodal = () => {
    setEditusermodal(false);
    setSingleuserId(null);
    setTeamImageUrl('');
    // setCroppedImage('');
  };

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const openDeleteUserModal = (id) => {
    setDeleteUserId(id);
    setOpenDeleteModal(true);
  };

  const [usersdata, setUsersdata] = useState([]);
  const [totalusers, setTotalusers] = useState(0);
  const [totalpages, setTotalpages] = useState(0);

  async function getAllTeamMembers(newPage = page, newLimit = limit, newSearchQuery = searchQuery) {
    setIsLoadingEffect(true);
    await Teamapi.get("getallteammembers", {
      params: {
        page: newPage,
        limit: newLimit,
        searchQuery: newSearchQuery,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
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
          return;
        }
        setUsersdata(data?.data || []);
        setTotalusers(data?.totalCount || 0);
        setTotalpages(data?.totalPages || 0);
        setIsLoadingEffect(false);
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
        setIsLoadingEffect(false);
        return false;
      });
  }

  const onpagechange = (value) => {
    setPage(value);
    getAllTeamMembers(value, limit, searchQuery);
  };

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      getAllTeamMembers(page, limit, e.target.value);
    },
    [page, limit]
  );

  const refreshUserData = useCallback(() => {
    setIsLoadingEffect(true);
    getAllTeamMembers(page, limit, searchQuery);
  }, [page, limit, searchQuery]);

  useEffect(() => {
    getAllTeamMembers(page, limit, searchQuery);
  }, []);

  const [teamImageUrl, setTeamImageUrl] = useState('');

  const [croppedImage, setCroppedImage] = useState("");
  const [teamImageError, setTeamImageError] = useState('');
  const updateTeamImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCroppedImage(URL.createObjectURL(file));
      setTeamImageError('');
    }
  };

  const teamImageRemove = () => {
    setCroppedImage(null);
    setTeamImageUrl("");
    setCroppedImage('')
  };

  const [featureImageModal, setFeatureImageModal] = useState(false);
  const openTeamImageModal = () => {
    setFeatureImageModal(true);
  };
  const closeTeamImageModal = () => {
    setFeatureImageModal(false)
    setCroppedImage(null);
  };

  return (
    <>
      <div className="flex max-sm:flex-wrap justify-between pb-2 mb-2 border-t-0 border-r-0 border-b-[0.6px] border-l-0 border-[#979797]/30">
        <div className="pl-1 max-sm:text-center max-sm:w-full max-sm:mb-[10px]">
          <h1 className="text-xl md:text-lg font-semibold max-sm:text-center">Teams</h1>
        </div>
        <div className="flex max-sm:flex-wrap max-sm:gap-[10px] justify-end max-sm:justify-center items-center">
          <div className="border border-[#ced4da] rounded-sm ml-2 relative">
            <input type="text" placeholder="Search team member..." className="focus:outline-none text-sm pl-6 py-1 " value={searchQuery} onChange={updateSearchQuery} />
            <div className="absolute left-0 top-2 px-1">
              <IconSearch size={16} color="#ced4da" />
            </div>
          </div>
          <button onClick={openAddnewmodal} className="ml-[10px] flex justify-center items-center relative px-4 py-[7px] rounded bg-[#044093]">
            <p className="flex-grow-0 flex-shrink-0 text-xs text-left cursor-pointer text-white">+ Add Member</p>
          </button>
        </div>
      </div>

      <div className="w-full relative overflow-hidden rounded-[4px] border-[0.6px] border-[#979797]/40">
        <table className="w-full text-left border-collapse">
          <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 bg-[#F3F3F3]">
            <tr>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Ref ID</p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Name</p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Designation</p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Experience</p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Date Joined</p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingEffect === false ? (
              usersdata?.length > 0 ? (
                usersdata?.map((user, index) => (
                  <tr key={index} className="truncate border-b-[0.6px] border-b-[#979797]/40">
                    <td className="truncate px-4 py-3 whitespace-nowrap">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">{user.uuid}</p>
                    </td>

                    <td className="px-4 py-3 truncate">
                      <div className="flex items-center space-x-2">
                        {user?.profile_image_url && (
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image src={user.profile_image_url} alt={user.name} width={24} height={24} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">{user?.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">{user.designation}</p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">{user?.experience || "N/A"}</p>
                    </td>

                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">{dayjs(user.createdAt).format("DD MMM YYYY")}</p>
                    </td>
                    <td className="text-center">
                      <div className="flex flex-row items-center gap-1">
                        <div onClick={() => openEditusermodal(user.id, user)} className="cursor-pointer">
                          <IconEdit />
                        </div>
                        <div onClick={() => openDeleteUserModal(user.uuid)} className="cursor-pointer">
                          <IconTrash color="#ff5555" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]">No data found</p>
                  </td>
                </tr>
              )
            ) : (
              <Tableloadingeffect colspan={6} tr={10} />
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-end py-4 px-3">
          <Pagination
            totalpages={totalpages}
            value={page}
            onChange={onpagechange}
            color="#044093"
          />
        </div>
        {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}
      </div>

      <Modal
        open={addnewmodal}
        size="lg"
        onClose={closeAddnewmodal}
        zIndex={999}
        withCloseButton={false}
        padding={"0px"}
      >
        {addnewmodal && (
          <Addnewmember
            closeAddnewmodal={closeAddnewmodal}
            refreshUserData={refreshUserData}
            openTeamImageModal={openTeamImageModal}
            closeTeamImageModal={closeTeamImageModal}
            teamImageUrl={teamImageUrl}
            setTeamImageUrl={setTeamImageUrl}
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
            teamImageError={teamImageError}
            setTeamImageError={setTeamImageError}
            updateTeamImage={updateTeamImage}
            teamImageRemove={teamImageRemove}
          />
        )}
      </Modal>

      <Modal
        open={editusermodal}
        size="lg"
        onClose={closeEditusermodal}
        zIndex={999}
        withCloseButton={false}
        padding="0px"
      >
        {editusermodal && (
          <Editmember
            closeEditusermodal={closeEditusermodal}
            singleuserId={singleuserId}
            refreshUserData={refreshUserData}
            openTeamImageModal={openTeamImageModal}
            closeTeamImageModal={closeTeamImageModal}
            teamImageUrl={teamImageUrl}
            setTeamImageUrl={setTeamImageUrl}
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
            teamImageError={teamImageError}
            setTeamImageError={setTeamImageError}
            updateTeamImage={updateTeamImage}
            teamImageRemove={teamImageRemove}
          />
        )}
      </Modal>

      <DeleteModal
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          setIsLoadingEffect(true);
          Teamapi.post("deletemember", {
            singleMember_id: deleteUserId,
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
              toast.success("Team member deleted successfully!", {
                position: "top-right",
              });
              setOpenDeleteModal(false);
              setIsLoadingEffect(false);
              refreshUserData();
              return false;
            })
            .catch((error) => {
              console.log('Error', error);
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
        }}
      />

      <Modal
        open={featureImageModal}
        size="50%"
        onClose={closeTeamImageModal}
        withCloseButton={false}
        margin="0px"
        padding="0px"
        zIndex={9999}
      >
        {featureImageModal && (
          <CropImage image={croppedImage} onClose={closeTeamImageModal} setCroppedImage={setTeamImageUrl} size={"team"} />
        )}
      </Modal>
    </>
  );
}

export default Teamwrapper;
