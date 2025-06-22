"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Errorpanel from "@/components/shared/Errorpanel";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import Addnewform from "./Addnewform";
import Employeeapi from "@/components/api/Employeeapi";
import DeleteModal from "@/components/shared/DeleteModal";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";

const Editrole = dynamic(() => import("./Editrole"), { ssr: false });
const Permissionpopup = dynamic(() => import("./Permissionpopup"), {
  ssr: false,
});

function Rolesandpermissionwrapper() {
  const userInfo = useEmployeDetails((state) => state.userInfo);
  const access_token = useEmployeDetails((state) => state.access_token);
  let user_id = userInfo?.user_id;

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [roledata, setRoledata] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function getClinetroledata(newPage, newlimit) {
    await Employeeapi.get(
      "/getallroledata",
      {
        params: {
          page: newPage,
          limit: newlimit,
          user_id: user_id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setRoledata(data.roledata);
        setTotalCount(data.totalrolescount);
        setTotalPages(data.totalpages);
        setIsLoading(false);
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
        setIsLoading(false);
        return false;
      });
  }

  const handlePageChange = useCallback((value) => {
    setPage(value);
    getClinetroledata(value, limit);
    setIsLoading(true);
  }, []);

  const reloadGetroledata = useCallback(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, [page, limit]);

  useEffect(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, []);

  const [permissionModal, setPermissionModal] = useState(false);

  const [roleId, setRoleId] = useState("");
  const openPermisissionsModal = useCallback(
    (id) => {
      setRoleId(id);
      setPermissionModal(true);
    },
    [roleId]
  );

  const closePermissionsModal = () => {
    setPermissionModal(false);
    setRoleId("");
  };

  const [roleDetails, setRoleDetails] = useState(null);
  const [roleEditModel, setRoleEditModel] = useState(false);
  const openEditRoleEditModel = useCallback(
    (id, role_details) => {
      setRoleEditModel(true);
      setRoleDetails(role_details);
      setRoleId(id);
    },
    [roleDetails, roleId]
  );

  const closeEditRoleEditModel = () => {
    setRoleEditModel(false);
    setRoleDetails(null);
    setRoleId("");
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const openRoleDeleteModal = (id) => {
    setDeleteUserId(id);
    setOpenDeleteModal(true);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-hidden max-sm:px-5">
        <div className="max-sm:basis-[100%] basis-[25%] w-full">
          <Addnewform reloadGetroledata={reloadGetroledata} />
        </div>
        <div className="max-sm:basis-[100%] basis-[75%] bg-white w-full relative overflow-hidden shadow-sm rounded-lg border-[0.6px] border-[#979797]">
          <div className="overflow-x-auto overflow-y-auto">
            <div>
              <table className="w-full text-left border-collapse">
                <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 ">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        SL#
                      </p>
                    </th>
                    <th scope="col" className="sticky_column_first px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        Name
                      </p>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        Permissions
                      </p>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        Default
                      </p>
                    </th>
                    <th scope="col" className="sticky_second_to_last px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        Status
                      </p>
                    </th>
                    <th scope="col" className="sticky_column_last px-4 py-3">
                      <p className="!text-[#2B2B2B] !text-[14px] not-italic !font-[500] leading-[18px]">
                        Actions
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#101828] text-[14px] not-italic font-medium leading-[18px]">
                  {isLoading === false ? (
                    roledata.length > 0 ? (
                      roledata.map((roledata, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#A1A5AD] truncate"
                        >
                          <td className="truncate left-0 px-4 py-3 bg-white font-medium text-gray-900 whitespace-nowrap">
                            <p className="text-[#667085] !text-[13px] not-italic !font-[500] leading-[18px]">
                              {index + 1}
                            </p>
                          </td>
                          <td className=" sticky_column_first px-4 py-3 truncate text-gray-900">
                            <p className=" text-[#667085] !text-[13px] not-italic !font-[500] leading-[18px]">
                              {roledata.role_name}
                            </p>
                          </td>
                          <td className="px-4 py-3 truncate text-gray-900">
                            <button
                              className="cursor-pointer px-2 py-1 bg-[#044093] text-white rounded-md text-[11px]"
                              onClick={() =>
                                openPermisissionsModal(roledata.role_id)
                              }
                            >
                              Update Permission
                            </button>
                          </td>
                          <td className="px-4 py-3 truncate text-gray-900">
                            {roledata.default_role === "Yes" ? (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white bg-[#044093] rounded-full">
                                <span className="w-2 h-2 bg-white rounded-full mr-1.5"></span>
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                                No
                              </span>
                            )}
                          </td>
                          <td className="sticky_second_to_last px-4 py-3 truncate text-gray-900">
                            {roledata.status === "Inactive" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fdecec] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#EC0606"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                                  Inactive
                                </p>
                              </div>
                            ) : roledata.status === "Active" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#ecfdf3] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#14BA6D"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">
                                  Active
                                </p>
                              </div>
                            ) : (
                              roledata.status === "Suspended" && (
                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#D6D6D6] w-fit">
                                  <svg
                                    width={9}
                                    height={8}
                                    viewBox="0 0 9 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <circle
                                      cx="4.42871"
                                      cy={4}
                                      r={3}
                                      fill="#434343"
                                    />
                                  </svg>
                                  <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                    Suspended
                                  </p>
                                </div>
                              )
                            )}
                          </td>
                          {roledata.role_name !== "Super Admin" && (
                            <td className="text-center">
                              <div className="flex flex-row items-center gap-1">
                                <div
                                  onClick={() =>
                                    openEditRoleEditModel(
                                      roledata.role_id,
                                      roledata
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <IconEdit />
                                </div>
                                <div
                                  onClick={() =>
                                    openRoleDeleteModal(roledata.role_id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IconTrash color="#ff5555" />
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p className="!text-[#4A4D53CC] !text-[14px] not-italic !font-[400] leading-[18px]">
                            No data found
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        <p className="!text-[#4A4D53CC] !text-[14px] not-italic !font-[400] leading-[18px]">
                          Loading...
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-row-reverse p-4 ">
            <Pagination
              totalpages={totalPages}
              value={page}
              siblings={1}
              onChange={handlePageChange}
              color="#044093"
            />
          </div>
        </div>
      </div>
      {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}

      <Modal
        open={permissionModal}
        onClose={closePermissionsModal}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {permissionModal === true && (
          <Permissionpopup
            closePermissionsModel={closePermissionsModal}
            roleId={roleId}
          />
        )}
      </Modal>

      <Modal
        open={roleEditModel}
        onClose={closeEditRoleEditModel}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {roleEditModel === true && (
          <Editrole
            closeEditRoleEditModel={closeEditRoleEditModel}
            roleId={roleId}
            roleDetails={roleDetails}
            reloadGetroledata={reloadGetroledata}
          />
        )}
      </Modal>

      <DeleteModal
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          Employeeapi.post(
            "/deleterole",
            {
              role_id: deleteUserId,
            },
            {}
          )
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setIsLoading(false);
                return false;
              }

              setOpenDeleteModal(false);
              setIsLoading(false);
              reloadGetroledata();
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
              setIsLoading(false);
              return false;
            });
        }}
      />
    </>
  );
}

export default Rolesandpermissionwrapper;
