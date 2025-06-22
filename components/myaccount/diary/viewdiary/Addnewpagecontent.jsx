"use client";
import Diariesapi from "@/components/api/Diariesapi";
import React, { useEffect, useState } from "react";
import Errorpanel from "@/components/shared/Errorpanel";
import { toast } from "react-toastify";
import { IconArrowBarToRight } from "@tabler/icons-react";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { Button, Card, Datepicker, Loadingoverlay } from "@nayeshdaggula/tailify";
import { Richtexteditor } from "@/components/shared/richtexteditor/Richtexteditor";

function Addnewpagecontent({ closeAddNewPageDrawer, diaryuid, diary_id, totalPages, refreshGetDiaryPages, diaryPageDetails, user_uid, is_contributed = false }) {
    const access_token = useUserDetails((state) => state.access_token);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [diaryContent, setDiaryContent] = useState("");
    const [diaryContentError, setDiaryContentError] = useState("");
    const updateDiarycontent = (value) => {
        setDiaryContent(value);
        setDiaryContentError("");
    };

    const [publishDate, setPublishDate] = useState(new Date())
    const [publishDateError, setPublishDateError] = useState('')
    const updatePublishDate = (date) => {
        setPublishDate(date)
        setPublishDateError('')
    }

    const [latestPublishDate, setLatestPublishDate] = useState(null);

    const getLatestPublishDate = (diaryId) => {
        setIsLoadingEffect(true);
        Diariesapi.get('getlatestpublisheddate', {
            params: {
                diary_id: diaryId,
            }
        }).then((res) => {
            const data = res.data;
            if (data.status === 'success') {
                setLatestPublishDate(data?.lastPublishDate);
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

    useEffect(() => {
        if (diary_id) {
            getLatestPublishDate(diary_id);
        }
    }, [diary_id]);

    const getMinDate = () => {
        if (!latestPublishDate) {
            // No latestPublishDate present, so minDate is today
            return new Date();
        }

        const now = new Date();

        // If latestPublishDate is in the past or today, use today's date
        if (new Date(latestPublishDate) <= now) {
            return now;
        }

        // If latestPublishDate is in the future, use it as the minimum date
        return new Date(latestPublishDate);
    };



    const handleContenchange = () => {
        if (is_contributed === true && diaryContent === "<p></p>") {
            setDiaryContentError("Please enter diary content");
            setIsLoadingEffect(false);
            return false;
        }

        if (!diaryContent) {
            setDiaryContentError("Please enter diary content");
            setIsLoadingEffect(false);
            return false;
        }

        if (publishDate === null) {
            setPublishDateError("Publish date is required");
            setIsLoadingEffect(false);
            return false;
        }
        const formdata = new FormData();
        formdata.append("diaryid", diary_id);
        formdata.append("diaryContent", diaryContent);
        formdata.append("diarypage", totalPages + 1);
        formdata.append("useruid", user_uid);
        formdata.append("is_publish_date", new Date(publishDate).toISOString());

        Diariesapi.post("/addpagecontent", formdata, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    console.log("finalres", finalresponse);
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(`Page added successfull`, {
                    position: "top-right",
                });
                setIsLoadingEffect(false);
                closeAddNewPageDrawer();
                refreshGetDiaryPages(diaryuid, totalPages + 1, true);
                return false;
            })
            .catch((error) => {
                console.log("Error file:", error);
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

    return (
        <div className="relative">
            <Card padding="0" margin="0" className="w-[100%] !rounded-none">
                <Card.Section className="!p-0 !py-4 !px-6">
                    <div className="flex justify-between items-center">
                        <p className="text-[#044093] font-bold text-xl md:text-[20px] max-sm:text-[17px]">Add new page</p>
                        <div onClick={closeAddNewPageDrawer} className="cursor-pointer">
                            <IconArrowBarToRight className="cursor-pointer" size={25} />
                        </div>
                    </div>
                </Card.Section>
                <Card.Section className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <Richtexteditor value={diaryContent} onChange={updateDiarycontent} />
                        {diaryContentError && <p className="text-red-500 text-sm">{diaryContentError}</p>}
                    </div>
                    <Datepicker
                        label="Publish Date"
                        value={publishDate}
                        onChange={updatePublishDate}
                        error={publishDateError}
                        minDate={getMinDate()}
                    />
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleContenchange} className="bg-[#040993] text-white !px-8 text-[14px]">
                            Add
                        </Button>
                    </div>
                </Card.Section>
            </Card>
            {isLoadingEffect && (
                <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
                    <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                </div>
            )}
            {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}
        </div>
    );
}
export default Addnewpagecontent;
