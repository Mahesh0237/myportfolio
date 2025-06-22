"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { Drawer, Modal, Pagination, Select, } from "@nayeshdaggula/tailify";
import EditEmployee from "./EditEmployee";
import AddnewEmployee from "./AddnewEmployee";
import SingleEmployeeview from "./SingleEmployeeview";
import Employeeapi from "@/components/api/Employeeapi";
import dayjs from "dayjs";
import DeleteModal from "@/components/shared/DeleteModal";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Errorpanel from "@/components/shared/Errorpanel";
import TableLoadingEffect from "@/components/shared/Tableloadingeffect";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";

function EmployeeWrapper() {
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const userInfo = useEmployeDetails((state) => state.user_info);
  const access_token = useEmployeDetails((state) => state.access_token);
  let user_id = userInfo?.user_id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const single_user_id = searchParams.get("single_user_id");

  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [sortby, setSortby] = useState("created_date");
  const [sortbyType, setSortbyType] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState("10");

  const [singleuserId, setSingleuserId] = useState(null);
  const [userview, setUserview] = useState(false);
  const openSingleuserview = useCallback((id) => {
    setSingleuserId(id);
    setUserview(true);
    router.push(pathname + "?" + createQueryString("single_user_id", id));
  }, [singleuserId]);

  const closeSingleuserview = () => {
    setUserview(false);
    router.push(pathname);
    setSingleuserId(null);
  };

  const [addnewmodal, setAddnewmodal] = useState(false);
  const openAddnewmodal = () => {
    setAddnewmodal(true);
  };
  const closeAddnewmodal = () => setAddnewmodal(false);

  const [userRole, setUserRole] = useState("");
  const [editusermodal, setEditusermodal] = useState(false);
  const openEditEmployeemodal = (user, role) => {
    setSingleuserId(user);
    setUserRole(role);
    setEditusermodal(true);
  };

  const closeEditEmployeemodal = () => {
    setEditusermodal(false);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSingleuserId(id);
  };
  const closeDeleteModal = () => setDeleteModal(false);
  const [usersdata, setUsersdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function GetAllEmployees(newPage, newLimit, newSearchQuery, newSortbyType, newSortby) {
    await Employeeapi.get("/getallemployees",
      {
        params: {
          page: newPage,
          limit: newLimit,
          searchQuery: newSearchQuery,
          sortbyType: newSortbyType,
          sortby: newSortby,
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
        setUsersdata(data.employees);
        setTotalUsers(data.totalEmployees);
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
    GetAllEmployees(value, limit);
    setIsLoading(true);
  }, []);

  const updateSortby = useCallback(
    (data) => {
      setSortby(data);
      GetAllEmployees(page, limit, searchQuery, sortbyType, data);
    },
    [page, limit, searchQuery, sortbyType]
  );

  const [sortByPanel, setSortByPanel] = useState(false);
  const sortByPanelToggle = () => setSortByPanel(!sortByPanel);

  const updateSortbyType = useCallback(
    (data) => {
      setSortbyType(data);
      getAllusersData(page, limit, searchQuery, data, sortby);
    },
    [page, limit, searchQuery, sortby]
  );

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      GetAllEmployees(page, limit, e.target.value, sortbyType, sortby);
    },
    [page, limit, sortbyType, sortby]
  );

  const updateLimit = useCallback(
    (data) => {
      let newpage = 1;
      setLimit(data);
      setPage(newpage);
      GetAllEmployees(newpage, data, searchQuery, sortbyType, sortby);
    },
    [page, searchQuery, sortbyType, sortby]
  );

  useEffect(() => {
    setIsLoading(true);
    GetAllEmployees(page, limit, searchQuery, sortbyType, sortby);
  }, []);

  const refreshUserData = useCallback(() => {
    setIsLoading(true);
    GetAllEmployees(page, limit, searchQuery, sortby);
  }, [page, limit, searchQuery, sortbyType, sortby]);

  const [refreshStatus, setRefreshStatus] = useState(false);
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (single_user_id) {
      openSingleuserview(single_user_id);
    }
  }, [single_user_id]);

  return (
    <>
      <div className="flex max-sm:flex-wrap justify-between pb-2 mb-2 border-t-0 border-r-0 border-b-[0.6px] border-l-0 border-[#979797]/30">
        <div className="pl-1 max-sm:text-center max-sm:w-full max-sm:mb-[10px]">
          <h1 className="text-xl md:text-lg font-semibold max-sm:text-center">
            Employees
          </h1>
        </div>
        <div className="flex max-sm:flex-wrap max-sm:gap-[10px] justify-end max-sm:justify-center items-center">
          {/* <div className="relative">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path
                                d="M6 15C5.6145 15.5228 5.45775 15.705 5.14125 15.7448C4.82475 15.7845 4.605 15.6022 4.16625 15.24C2.53575 13.89 1.5 11.8687 1.5 9.61125C1.5 5.54625 4.85775 2.25 9 2.25C13.1422 2.25 16.5 5.5455 16.5 9.61125C16.5 11.8687 15.4642 13.8892 13.8337 15.24C13.395 15.603 13.176 15.7845 12.8588 15.7448C12.5423 15.705 12.3855 15.5228 12 15M10.125 7.875L13.5 3.75"
                                stroke="#2B2B2B"
                                strokeOpacity="0.6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 10.125C9.62132 10.125 10.125 9.62132 10.125 9C10.125 8.37868 9.62132 7.875 9 7.875C8.37868 7.875 7.875 8.37868 7.875 9C7.875 9.62132 8.37868 10.125 9 10.125Z"
                                stroke="#2B2B2B"
                                strokeOpacity="0.6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <select
                            className="pl-8 pr-2 py-[6px] text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-0"
                            value={limit}
                            onChange={updateLimit}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div> */}
          <div className=" ">
            <Select
              data={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "30", label: "30" },
                { value: "40", label: "40" },
                { value: "50", label: "50" },
              ]}
              placeholder="10"
              value={limit}
              onChange={updateLimit}
              inputClassName="focus:ring-0 !focus:border-[#fff] focus:outline-none"
              className="!m-0 !p-0  !border-0"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#044093] focus:outline-none"
            />
          </div>
          <div className="border border-[#ced4da] rounded-sm ml-2 relative">
            <input
              type="text"
              placeholder="Search employees..."
              className="focus:outline-none text-sm pl-6 py-1 "
              onChange={updateSearchQuery}
              value={searchQuery}
            />
            <div className="absolute left-0 top-2 px-1">
              <IconSearch size={16} color="#ced4da" />
            </div>
          </div>
          <button
            onClick={openAddnewmodal}
            className="cursor-pointer ml-[10px] flex justify-center items-center relative px-4 py-[7px] rounded bg-[#044093]"
          >
            <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">
              + Add Employee{" "}
            </p>
          </button>
        </div>
      </div>

      <div className="w-full relative overflow-hidden rounded-[4px] border-[0.6px] border-[#979797]/40">
        <table className="w-full text-left border-collapse">
          <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 bg-[#F3F3F3]">
            <tr>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Ref ID
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Name
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Email Address
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Phone Number
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Role
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Reporting Head
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Date Joined
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Status
                </p>
              </th>
              <th scope="col" className="px-4 py-3">
                <p className="text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]">
                  Actions
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading === false ? (
              usersdata.length > 0 ? (
                usersdata.map((user, index) => (
                  <tr
                    key={index}
                    className="truncate border-b-[0.6px] border-b-[#979797]/40"
                  >
                    <td className="truncate px-4 py-3 whitespace-nowrap">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {user?.uuid}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {user.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        +{user.phone_code} {user.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {user.role_name}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {user.reporting_head_name
                          ? user.reporting_head_name
                          : "----"}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <p className="text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]">
                        {dayjs(user?.joinedAt).format("DD MMM YYYY")}
                      </p>
                    </td>
                    <td className="px-4 py-3 truncate">
                      {user.status === "Inactive" ? (
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
                            <circle cx="4.42871" cy={4} r={3} fill="#EC0606" />
                          </svg>
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                            Inactive
                          </p>
                        </div>
                      ) : user.status === "Active" ? (
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
                            <circle cx="4.42871" cy={4} r={3} fill="#14BA6D" />
                          </svg>
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">
                            Active
                          </p>
                        </div>
                      ) : (
                        user.status === "Suspended" && (
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
                    <td className="text-center">
                      <div className="flex flex-row items-center gap-1">
                        <div
                          onClick={() => {
                            openSingleuserview(user.id);
                          }}
                          className="cursor-pointer"
                        >
                          <IconEye />
                        </div>
                        <div
                          onClick={() => {
                            openEditEmployeemodal(user?.id, user?.role_name);
                          }}
                          className="cursor-pointer"
                        >
                          <IconEdit />
                        </div>
                        <div
                          onClick={() => openDeleteModal(user.id)}
                          className="cursor-pointer"
                        >
                          <IconTrash />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]">
                      No data found
                    </p>
                  </td>
                </tr>
              )
            ) : (
              <TableLoadingEffect colspan={7} tr={10} />
            )}
          </tbody>
        </table>
        <div className="flex flex-row-reverse p-4 ">
          <Pagination
            totalpages={totalPages}
            value={page}
            siblings={1}
            onChange={handlePageChange}
            color="#044093"
          />
        </div>
        {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}
      </div>

      <Modal
        open={addnewmodal}
        size="50%"
        onClose={closeAddnewmodal}
        withCloseButton={false}
        margin="0px"
        padding="0px"
      >
        {addnewmodal && (
          <AddnewEmployee
            closeAddnewmodal={closeAddnewmodal}
            refreshUserData={refreshUserData}
          />
        )}
      </Modal>

      <Modal
        open={editusermodal}
        size="40%"
        onClose={closeEditEmployeemodal}
        withCloseButton={false}
        zIndex={1000}
        margin="0px"
        padding="0px"
      >
        {editusermodal && (
          <EditEmployee
            closeEditEmployeemodal={closeEditEmployeemodal}
            singleuserId={singleuserId}
            userRole={userRole}
            refreshUserData={refreshUserData}
            setRefreshStatus={setRefreshStatus}
          />
        )}
      </Modal>

      <Drawer
        size={"50%"}
        padding="5%"
        position="right"
        overlayProps={{ backgroundOpacity: 0.2 }}
        bg={"transparent"}
        zIndex={100}
        open={userview}
        withCloseButton={false}
      >
        {userview && (
          <SingleEmployeeview
            closeSingleuserview={closeSingleuserview}
            singleUserid={singleuserId}
            openEditEmployeemodal={openEditEmployeemodal}
            setRefreshStatus={setRefreshStatus}
            refreshStatus={refreshStatus}
          />
        )}
      </Drawer>
      <DeleteModal
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          Employeeapi.post("deleteemployee", {
            singleuser_id: singleuserId,
          })
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
              }

              closeDeleteModal();
              refreshUserData();
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
              return false;
            });
        }}
      />
    </>
  );
}

export default EmployeeWrapper;
