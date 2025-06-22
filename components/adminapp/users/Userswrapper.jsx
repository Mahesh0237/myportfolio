'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IconEdit, IconEye, IconSearch, IconTrash } from '@tabler/icons-react'
import { Drawer, Modal, Pagination } from '@nayeshdaggula/tailify'
import Addnewuser from './Addnewuser'
import Edituser from './Edituser'
import Singleuserview from './Singleuserview'
import DeleteModal from '@/components/shared/DeleteModal'
import Userapi from '@/components/api/Userapi'
import dayjs from 'dayjs'
import Tableloadingeffect from '@/components/shared/Tableloadingeffect'
import Generalapi from '@/components/api/Generalapi'
import Errorpanel from '@/components/shared/Errorpanel'
import { toast } from 'react-toastify'
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails'

function Userswrapper() {
    const access_token = useEmployeDetails(state => state.access_token);
    const [page, setPage] = useState(1);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [limit, setLimit] = useState('10');
    const [singleuserUId, setSingleuserUId] = useState('')
    const [userview, setUserview] = useState(false)
    const openSingleuserview = (id) => {
        setSingleuserUId(id)
        setUserview(true)
    }
    const closeSingleuserview = () => {
        setUserview(false)
    }

    const [addnewmodal, setAddnewmodal] = useState(false);
    const openAddnewmodal = () => {
        setAddnewmodal(true)
    };
    const closeAddnewmodal = () => setAddnewmodal(false);

    const [editusermodal, setEditusermodal] = useState(false);
    const openEditusermodal = (uid) => {
        setSingleuserUId(uid);
        setEditusermodal(true);
    };

    const closeEditusermodal = () => {
        setEditusermodal(false);
    }
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const openDeleteUserModal = (id) => {
        setDeleteUserId(id);
        setOpenDeleteModal(true);
    }

    const [usersdata, setUsersdata] = useState([]);
    const [totalpages, setTotalpages] = useState(0);
    const [refreshStatus, setRefreshStatus] = useState(false);

    async function getAllUsersData(newPage = page, newLimit = limit, newSearchQuery = searchQuery) {
        setIsLoadingEffect(true);
        await Userapi.get('/getusers', {
            params: {
                page: newPage,
                limit: newLimit,
                searchQuery: newSearchQuery,
            },
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setUsersdata(data.users);
                setTotalpages(data.totalPages);
                setIsLoadingEffect(false);
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

    const onpagechange = (value) => {
        setPage(value);
        getAllUsersData(value, limit, searchQuery);
    }

    const updateSearchQuery = useCallback((e) => {
        setSearchQuery(e.target.value);
        getAllUsersData(page, limit, e.target.value);
    }, [page, limit]);

    const updateLimit = useCallback((data) => {
        let newpage = 1;
        setLimit(data);
        setPage(newpage);
        getAllUsersData(newpage, data, searchQuery);
    }, [page, searchQuery]);

    const refreshUserData = useCallback(() => {
        setIsLoadingEffect(true)
        getAllUsersData(page, limit)
    }, [page, limit, searchQuery])

    const [countryCodes, setCountryCodes] = useState([]);
    async function fetchCountryCodes() {
        setIsLoadingEffect(true);
        await Generalapi.get('getcountries')
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setCountryCodes(data.countrydata);
                setIsLoadingEffect(false);
                return false
            })
            .catch((error) => {
                console.log(error)
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
        fetchCountryCodes();
        getAllUsersData();
    }, [])

    return (
        <>
            <div className='flex max-sm:flex-wrap justify-between pb-2 mb-2 border-t-0 border-r-0 border-b-[0.6px] border-l-0 border-[#979797]/30'>
                <div className="pl-1 max-sm:text-center max-sm:w-full max-sm:mb-[10px]">
                    <h1 className="text-xl md:text-lg font-semibold max-sm:text-center">Users</h1>
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

                    <div className='border border-[#ced4da] rounded-sm ml-2 relative'>
                        <input
                            type='text'
                            placeholder='Search users...'
                            className='focus:outline-none text-sm pl-6 py-1 '
                            value={searchQuery}
                            onChange={updateSearchQuery}
                        />
                        <div className='absolute left-0 top-2 px-1'>
                            <IconSearch size={16} color='#ced4da' />
                        </div>
                    </div>
                    <button onClick={openAddnewmodal} className="ml-[10px] flex justify-center items-center relative px-4 py-[7px] rounded bg-[#044093]" >
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left cursor-pointer text-white">+ Add User</p>
                    </button>
                </div>
            </div>

            <div className="w-full relative overflow-hidden rounded-[4px] border-[0.6px] border-[#979797]/40" >
                <table className="w-full text-left border-collapse">
                    <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 bg-[#F3F3F3]">
                        <tr>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Ref ID
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Name
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Email Address
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Phone Number
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Date Joined
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Status
                                </p>
                            </th>
                            <th scope="col" className="px-4 py-3">
                                <p className='text-[#2B2B2B] text-[14px] not-italic font-[500] leading-[18px]'>
                                    Actions
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoadingEffect === false ?
                                usersdata?.length > 0 ?
                                    usersdata?.map((employee, index) =>
                                        <tr
                                            key={index}
                                            className="truncate border-b-[0.6px] border-b-[#979797]/40">
                                            <td className="truncate px-4 py-3 whitespace-nowrap">
                                                <p className='text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]'>
                                                    {employee.uuid}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 truncate">
                                                <p className='text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]'>
                                                    {employee.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 truncate">
                                                <p className='text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]'>
                                                    {employee.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 truncate">
                                                <p className='text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]'>
                                                    +{employee.phone_code}  {employee.phone_number}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3 truncate">
                                                <p className='text-[#2B2B2B] text-[12px] not-italic font-[500] leading-[18px]'>
                                                    {dayjs(employee.createdAt).format('DD MMM YYYY')}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 truncate">
                                                {
                                                    employee?.users_status === 'Inactive' ?
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
                                                        : employee?.users_status === 'Active' ?
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
                                                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">Active</p>
                                                            </div>
                                                            : employee?.users_status === 'Suspended' &&
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
                                                                    <circle cx="4.42871" cy={4} r={3} fill="#434343" />
                                                                </svg>
                                                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                                                    Suspended
                                                                </p>
                                                            </div>
                                                }
                                            </td>
                                            <td className='text-center'>
                                                <div className='flex flex-row items-center gap-1'>
                                                    <div onClick={() => openSingleuserview(employee.uuid)} className='cursor-pointer'>
                                                        <IconEye />
                                                    </div>
                                                    <div onClick={() => { openEditusermodal(employee.uuid) }} className='cursor-pointer'>
                                                        <IconEdit />
                                                    </div>
                                                    <div onClick={() => openDeleteUserModal(employee.uuid)} className='cursor-pointer'>
                                                        <IconTrash color='#ff5555' />
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                    :
                                    <tr>
                                        <td colSpan={7} className='text-center py-4'>
                                            <p className='text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]'>
                                                No data found
                                            </p>
                                        </td>
                                    </tr>
                                :
                                <Tableloadingeffect colspan={7} tr={10} />
                        }
                    </tbody>
                </table>
                <div className="flex justify-end items-end py-4 px-3">
                    <Pagination
                        totalpages={totalpages}
                        value={page}
                        onChange={onpagechange}
                        color='#044093'
                    />
                </div>
                {
                    errorMessage !== '' &&
                    <Errorpanel
                        errorMessages={errorMessage}
                    />
                }
            </div>

            <Modal
                open={addnewmodal}
                size='lg'
                onClose={closeAddnewmodal}
                zIndex={200}
                withCloseButton={false}
            >
                {
                    addnewmodal &&
                    <Addnewuser
                        closeAddnewmodal={closeAddnewmodal}
                        refreshUserData={refreshUserData}
                        countryCodes={countryCodes}
                    />
                }
            </Modal>

            <Modal
                open={editusermodal}
                size='lg'
                onClose={closeEditusermodal}
                zIndex={200}
                withCloseButton={false}
                padding='0px'
            >
                {
                    editusermodal &&
                    <Edituser
                        closeEditusermodal={closeEditusermodal}
                        singleuserUId={singleuserUId}
                        refreshUserData={refreshUserData}
                        countryCodes={countryCodes}
                        setRefreshStatus={setRefreshStatus}
                    />
                }
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
                    <Singleuserview
                        closeSingleuserview={closeSingleuserview}
                        singleuserUId={singleuserUId}
                        openEditusermodal={openEditusermodal}
                        refreshStatus={refreshStatus}
                        setRefreshStatus={setRefreshStatus}
                    />
                )}
            </Drawer>

            <DeleteModal
                title='Delete Employee'
                message='Are you sure you want to delete this employee?'
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={() => {
                    setIsLoadingEffect(true);
                    Userapi.post('deleteuser', {
                        single_user_uid: deleteUserId,
                    })
                        .then((response) => {
                            let data = response.data;
                            if (data.status === 'error') {
                                let finalresponse = {
                                    'message': data.message,
                                    'server_res': data
                                }
                                console.error("Delete error: ", data.message);
                                setIsLoadingEffect(false);
                                return false;
                            }
                            toast.success(data.message);
                            setOpenDeleteModal(false)
                            refreshUserData();
                            return false
                        })
                        .catch((error) => {
                            console.log(error.message)
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
                            setIsLoadingEffect(false);
                            return false;
                        })
                }}
            />
        </>
    )
}

export default Userswrapper 