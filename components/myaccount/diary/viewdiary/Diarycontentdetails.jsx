import React, { useCallback, useEffect, useState } from 'react'
import config from '@/config';
import Addnewpagecontent from './Addnewpagecontent';
import Diariesapi from '@/components/api/Diariesapi';
import Errorpanel from '@/components/shared/Errorpanel';
import Editdiarypagecontent from './Editdiarypagecontent';
import { Button, Drawer, Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconCaretLeftFilled, IconCaretRightFilled, IconEdit, IconEye, IconPlus, IconShare, IconTrash } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import DeleteModal from '@/components/shared/DeleteModal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Diarycontentdetails({ diaryContent, totalPages, uid, refreshSingleViewDairyData, diary_id, isLoadingEffect, setIsLoadingEffect, diaryPageDetails, user_uid, updateDiarypageno, setTotalPages }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [content, setContent] = useState(diaryContent ?? '');
    const [contributedBy, setContributedBy] = useState(diaryPageDetails?.added_by ?? '');

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const diarypage_no = searchParams.get("page_no");
    // const [diaryAccessStatus, setDiaryAccessStatus] = useState(diaryPageDetails?.diary_page_access_status || "free");
    const [editDiarypage, setEditDiarypage] = useState(false);

    const openEditDiarypage = () => {
        setEditDiarypage(true);
    };
    const closeEditDiarypage = () => {
        setEditDiarypage(false);
    };

    const getDiaryPages = (diaryUid, pageParam) => {
        setIsLoadingEffect(true);
        Diariesapi.get('getdiarypages', {
            params: {
                diary_uid: diaryUid,
                page_no: pageParam
            }
        }).then((res) => {
            const data = res.data;
            if (data.status === 'success') {
                setContent(data.content);
                setContributedBy(data.added_by);
                // setDiaryAccessStatus(data.diary_page_access_status);
                setErrorMessage('');
                setIsLoadingEffect(false);
                return false;
            } else {
                const finalresponse = {
                    message: data.message,
                    server_res: data
                };
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            }
        }).catch((error) => {
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
            setIsLoadingEffect(false);
            return false;
        });
    };

    const [addNewPageDrawer, setAddNewPageDrawer] = useState(false);
    const openAddNewPageDrawer = () => {
        setAddNewPageDrawer(true);
    };
    const closeAddNewPageDrawer = () => {
        setAddNewPageDrawer(false);
    };

    useEffect(() => {
        if (diaryContent) {
            setContent(diaryContent);
        }
        if (diaryPageDetails?.added_by) {
            setContributedBy(diaryPageDetails?.added_by);
        }
    }, [diaryContent, diaryPageDetails?.added_by])


    /// Responsive Conditioning
    const [modalSize, setModalSize] = useState("70vw");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setModalSize("100vw");
            } else {
                setModalSize("70vw");
            }
        };

        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this link!',
                url: `${config.main_url}/diarydetails/${uid}/${currentPage}`,
            }).catch((error) => console.log('Sharing failed', error));
        } else {
            alert('Share not supported on this browser. Please copy the URL manually.');
        }
    };

    const refreshGetDiaryPages = useCallback((diaryuid, pagno, addpage) => {
        if (addpage) {
            setTotalPages(pagno)
        }
        setCurrentPage(pagno)
        getDiaryPages(diaryuid, pagno)
    }, [])

    const [deleteDiaryPageModal, setDeleteDiaryPageModal] = useState(false);
    const openDeleteDiaryPageModal = () => {
        setDeleteDiaryPageModal(true);
    };
    const closeDeleteDiaryPageModal = () => {
        setDeleteDiaryPageModal(false);
    };

    const handleDeletePage = async () => {
        setIsLoadingEffect(true);
        await Diariesapi.post('/deletediarypage', {
            diary_uid: uid,
            diarypage_no: currentPage
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalresponse = {
                        message: data.message,
                        server_res: data
                    }
                    setErrorMessage(finalresponse)
                    setIsLoadingEffect(false);
                }
                setIsLoadingEffect(false);
                toast.success('diary page deleted successfully')
                closeDeleteDiaryPageModal()
                setCurrentPage(1)
                setTotalPages(totalPages - 1)
                getDiaryPages(uid, 1)
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
                setIsLoadingEffect(false);
                return false;
            });
    }

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        if (diarypage_no) {
            setCurrentPage(parseInt(diarypage_no));
        }
    }, [diarypage_no]);

    return (
        <>
            <div className='relative flex flex-col h-full'>
                <div className={`flex md:justify-between flex-col md:flex-row gap-5 px-6 ${contributedBy ? "py-10" : "py-6"}`}>
                    {/*  */}
                    <div>
                        {contributedBy && <p className="absolute top-2 left-6 text-[14px] font-semibold text-[#044093]">Contributed By: <span className='text-[#2b2b2b]'>{contributedBy}</span></p>}
                        <div className='flex flex-wrap items-center gap-2'>
                            {(diaryPageDetails?.author_details?.author_uid === user_uid || diaryPageDetails?.diary_type === "Group") &&
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant='default'
                                        onClick={openEditDiarypage}
                                        className="!px-2 flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[28px] 2xl:px-4">
                                        <IconEdit className='h-3.5 w-6 2xl:h-6 2xl:w-9' />
                                        Edit page
                                    </Button>
                                    <Button
                                        variant='default'
                                        onClick={openAddNewPageDrawer}
                                        className="!px-2 flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[28px] 2xl:px-4">
                                        <IconPlus className='h-3.5 w-6 2xl:h-6 2xl:w-9' />
                                        Add page
                                    </Button>
                                </div>
                            }
                            <Button
                                variant='default'
                                className="!px-2 flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[26px] !rounded-sm"
                                onClick={handleShare}
                            >
                                <IconShare className='h-3.5 w-6 2xl:h-6 2xl:w-11' />
                                {diaryPageDetails?.pagesharecount}
                            </Button>
                            <Button
                                variant='default'
                                className="!px-2 flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[26px] !rounded-sm"
                            >
                                <IconEye className='h-3.5 w-6 2xl:h-6 2xl:w-11' />
                                {diaryPageDetails?.pageviewscount}
                            </Button>
                            <Button
                                variant='default'
                                className="!px-2 !py-2 flex items-center justify-center text-[12px] !text-[#044093] !border-1 !border-[#044093] cursor-pointer 2xl:text-[26px] !rounded-sm"
                            >
                                {diaryPageDetails?.diary_page_status}
                            </Button>
                            {
                                (diaryPageDetails?.author_details?.author_uid === user_uid && totalPages > 1) &&
                                <Button onClick={openDeleteDiaryPageModal} variant="light" className="flex items-center justify-center text-[12px] !text-[#fff] cursor-pointer !rounded-[6px] !bg-[#B91C1C] 2xl:text-[24px] 2xl:px-5">
                                    <IconTrash className="h-3.5 w-6 2xl:h-6 2xl:w-11" />
                                    Delete Page
                                </Button>
                            }
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        {/* <p className='mr-2'>Page: No. {currentPage}</p> */}
                        <div className="flex justify-start items-center space-x-2">
                            <div className="items-center justify-center p-1 text-md font-semibold w-fit h-fit  bg-[#fff] text-[#044093] rounded-sm">Page No: {currentPage}/{totalPages}</div>
                            <Button
                                variant='default'
                                className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === 1 ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                                onClick={() => {
                                    let newPage;
                                    if (currentPage > 1) {
                                        newPage = currentPage - 1;
                                        setCurrentPage(newPage);
                                        updateDiarypageno(newPage)
                                        getDiaryPages(uid, newPage); // Use unified API for both directions
                                    }
                                    router.push(pathname + "?" + createQueryString("page_no", newPage));
                                }}
                            >
                                <IconCaretLeftFilled
                                    color={currentPage === 1 ? '#2b2b2b99' : '#044093'}
                                    className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                                />
                                {/* <IconChevronLeft color={currentPage === 1 ? '#2b2b2b99' : '#044093'} className={`${currentPage === 1 ? 'cursor-not-allowed ' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`} /> */}
                            </Button>
                            <Button
                                variant='default'
                                className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === totalPages ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                                // className={`!p-1 !border-1 ${currentPage === totalPages ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                                onClick={() => {
                                    let newPage;
                                    if (currentPage < totalPages) {
                                        newPage = currentPage + 1;
                                        setCurrentPage(newPage);
                                        updateDiarypageno(newPage)
                                        getDiaryPages(uid, newPage);
                                    }
                                    router.push(pathname + "?" + createQueryString("page_no", newPage));
                                }}
                            >
                                <IconCaretRightFilled
                                    color={currentPage === totalPages ? '#2b2b2b99' : '#044093'}
                                    className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                                />
                                {/* <IconChevronRight color={currentPage === totalPages ? '#2b2b2b99' : '#044093'} className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`} /> */}
                            </Button>
                        </div>
                    </div>
                </div>
                {
                    content === "" ?
                        <div className="flex flex-row justify-center items-center px-6">
                            <div className='w-[100%] my-5 flex flex-col items-center justify-center h-[250px] b rounded-md'>
                                <p className='text-gray-700 text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No content available for this page</p>
                            </div>
                        </div>
                        :
                        <div
                            className="min-h-[350px] lg:min-h-0 lg:h-full px-6 space-y-6 font-medium text-[#2B2B2B] text-justify text-[12px] leading-[24px] text-wrap 2xl:text-[30px]"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></div>
                }
                <div className="flex justify-end items-center space-x-2 px-6 pb-6 mt-auto">
                    <div className="items-center justify-center p-1 text-md font-semibold w-fit h-fit  bg-[#fff] text-[#044093] rounded-sm">{currentPage}/{totalPages}</div>
                    {/* <div className="items-center justify-center p-1 text-md font-semibold w-fit h-fit  bg-[#fff] text-[#044093] rounded-sm">{currentPage}/{totalPages}</div> */}
                    <Button
                        variant='default'
                        className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === 1 ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                        onClick={() => {
                            let newPage;
                            if (currentPage > 1) {
                                newPage = currentPage - 1;
                                setCurrentPage(newPage);
                                updateDiarypageno(newPage)
                                getDiaryPages(uid, newPage); // Use unified API for both directions
                            }
                            router.push(pathname + "?" + createQueryString("page_no", newPage));
                        }}
                    >
                        <IconCaretLeftFilled
                            color={currentPage === 1 ? '#2b2b2b99' : '#044093'}
                            className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                        />
                        {/* <IconChevronLeft color={currentPage === 1 ? '#2b2b2b99' : '#044093'} className={`${currentPage === 1 ? 'cursor-not-allowed ' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`} /> */}
                    </Button>
                    <Button
                        variant='default'
                        className={`!p-1 !border-[#d4c9c9cc] !bg-[#f1f5f9] !rounded-sm ${currentPage === totalPages ? ' !border-[#2b2b2b99] !bg-[#fff]' : '!border-[#044093]'}`}
                        // className={`!p-1 !border-1 ${currentPage === totalPages ? ' !border-[#2b2b2b99]' : '!border-[#044093]'}`}
                        onClick={() => {
                            let newPage;
                            if (currentPage < totalPages) {
                                newPage = currentPage + 1;
                                setCurrentPage(newPage);
                                updateDiarypageno(newPage)
                                getDiaryPages(uid, newPage);
                            }
                            router.push(pathname + "?" + createQueryString("page_no", newPage));
                        }}
                    >
                        <IconCaretRightFilled
                            color={currentPage === totalPages ? '#2b2b2b99' : '#044093'}
                            className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`}
                        />
                        {/* <IconChevronRight color={currentPage === totalPages ? '#2b2b2b99' : '#044093'} className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} h-5 w-fit 2xl:h-8`} /> */}
                    </Button>
                </div>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={true} overlayBg='' />
                    </div>
                }
            </div>
            <Drawer
                size={modalSize}
                padding="5%"
                position="right"
                overlayProps={{ backgroundOpacity: 0.2 }}
                open={addNewPageDrawer}
                onClose={closeAddNewPageDrawer}
                bg={"transparent"}
                zIndex={100}
                withCloseButton={false}
            >
                {addNewPageDrawer && (
                    <Addnewpagecontent
                        totalPages={totalPages}
                        closeAddNewPageDrawer={closeAddNewPageDrawer}
                        diaryuid={uid}
                        diary_id={diary_id}
                        diaryPageDetails={diaryPageDetails}
                        user_uid={user_uid}
                        refreshGetDiaryPages={refreshGetDiaryPages}
                    />
                )}
            </Drawer>
            <Drawer
                size={modalSize}
                padding="5%"
                position="right"
                overlayProps={{ backgroundOpacity: 0.2 }}
                open={editDiarypage}
                onClose={closeEditDiarypage}
                bg={"transparent"}
                zIndex={100}
                withCloseButton={false}
            >
                {editDiarypage && (
                    <Editdiarypagecontent
                        closeEditDiarypage={closeEditDiarypage}
                        diaryuid={uid}
                        currentPage={currentPage}
                        diaryContent={content}
                        diaryPageDetails={diaryPageDetails}
                        user_uid={user_uid}
                        refreshGetDiaryPages={refreshGetDiaryPages}
                    // diary_access_status={diaryAccessStatus}
                    />
                )}
            </Drawer>
            <DeleteModal
                size={modalSize}
                title="Delete Diary Page"
                message="Are you sure you want to delete this diary page?"
                open={deleteDiaryPageModal}
                onClose={closeDeleteDiaryPageModal}
                onConfirm={handleDeletePage}
            />
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </>
    );
}

export default Diarycontentdetails;
