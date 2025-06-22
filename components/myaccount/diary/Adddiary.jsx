"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Diariesapi from "@/components/api/Diariesapi";
import Errorpanel from "@/components/shared/Errorpanel";
import DeleteModal from "@/components/shared/DeleteModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { Button, Datepicker, Fileinput, Loadingoverlay, Modal, Select, Textinput } from "@nayeshdaggula/tailify";
import CropImage from "@/components/shared/CropImage";
import { Richtexteditor } from "@/components/shared/richtexteditor/Richtexteditor";

function Adddiary({ user_uid }) {
  const userInfo = useUserDetails((state) => state.user_info);
  const router = useRouter();

  const user_id = userInfo?.user_id;
  const [categories, setCategories] = useState([]);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategorylable, setSelectedCategorylable] = useState("");
  const [selectedCategoryError, setSelectedCategoryError] = useState("");
  const onCategorySelect = (value) => {
    setSelectedCategory(value);
    setSelectedCategoryError("");
  };

  const [diaryName, setDiaryName] = useState("");
  const [diaryNameError, setDiaryNameError] = useState("");
  const onDiaryNameChange = (e) => {
    setDiaryName(e.target.value);
    setDiaryNameError("");
  };

  const [isPrivate, setIsPrivate] = useState(false);
  const [diaryType, setDiaryType] = useState("Individual");
  const onDiaryTypeChange = (value) => {
    setDiaryType(value);
    if (value === "Group") {
      setIsPrivate(true);
    }
    if (value === "Subscription") {
      setIsPrivate(false);
    }
  }

  // const [diaryAccessStatus, setDiaryAccessStatus] = useState("free");
  // const onDiaryAccessStatusChange = (value) => {
  //   setDiaryAccessStatus(value);
  // }

  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImageError, setFeaturedImageError] = useState("");
  const updateFeaturedImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setFeaturedImageUrl(URL.createObjectURL(file));
      setFeaturedImageError("");
    }
  };
  const [croppedImage, setCroppedImage] = useState("");

  const featuredImageRemove = () => {
    setFeaturedImage(null);
    setFeaturedImageUrl("");
    setCroppedImage('')
  };

  const [featureImageModal, setFeatureImageModal] = useState(false);
  const openFeatureImageModal = () => {
    setFeatureImageModal(true);
  };
  const closeFeatureImageModal = () => setFeatureImageModal(false);

  const [diaryContent, setDiaryContent] = useState("");
  const [diaryContentError, setDiaryContentError] = useState("");
  const onContentChange = (value) => {
    setDiaryContent(value);
    setDiaryContentError("");
  };
  const [storePublishDate, setStorePublishDate] = useState(null);
  const [publishDate, setPublishDate] = useState(new Date())
  const [publishDateError, setPublishDateError] = useState('')
  const updatePublishDate = (date) => {
    setPublishDate(date)
    setStorePublishDate(date);
    setPublishDateError('')
  }




  const [diaryPage, setDiaryPage] = useState(1);
  const [diaryId, setDiaryId] = useState(null);

  const getCategories = () => {
    Diariesapi.get("/getcategories")
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          const finalresponse = {
            status: "error",
            message: data.message,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        setErrorMessage("");
        setCategories(data?.categories || []);
        return false;
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
        return false;
      });
  };

  const submitDiary = async (isClose) => {
    setIsLoadingEffect(true);
    if (diaryPage === 1) {
      if (selectedCategory === "") {
        setSelectedCategoryError("Please select a category");
        setIsLoadingEffect(false);
        return false;
      }
      if (diaryName === "") {
        setDiaryNameError("Please enter diary name");
        setIsLoadingEffect(false);
        return false;
      }
      if (croppedImage === "" || croppedImage === null) {
        setFeaturedImageError("Featured Image is required");
        setIsLoadingEffect(false);
        return false;
      }
    }

    if (publishDate === null) {
      setPublishDateError("Publish date is required");
      setIsLoadingEffect(false);
      return false;
    }

    // if (diaryContent === "") {
    //   setDiaryContentError("Please enter diary content");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    let cropedImagefile = null;
    if (croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const randomNum = Math.floor(Math.random() * 1000000);
      const fileExtension = blob.type.split('/')[1];
      const randomFileName = `cropped-image-${randomNum}.${fileExtension}`;

      cropedImagefile = new File([blob], randomFileName, { type: blob.type });
    }

    const formdata = new FormData();
    if (diaryPage === 1) {
      formdata.append("selectedCategory", selectedCategory);
      formdata.append("diaryName", diaryName);
      formdata.append("featuredImage", cropedImagefile);
      formdata.append("isPrivate", isPrivate);
      formdata.append("user_id", user_id);
      formdata.append("diaryType", diaryType);
    } else {
      formdata.append("diaryid", diaryId);
    }
    formdata.append("diaryContent", diaryContent);
    formdata.append("diarypage", diaryPage);
    formdata.append("is_publish_date", new Date(publishDate).toISOString());
    formdata.append("useruid", user_uid)
    // formdata.append("diaryAccessStatus", diaryAccessStatus);

    const endpoint = diaryPage === 1 ? "/adddiary" : "/addpagecontent";

    Diariesapi.post(endpoint, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
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
        }
        if (diaryPage === 1) {

          setDiaryId(data.diaryid);
          setSelectedCategorylable(data.categoryName);
        }
        if (isClose) {

          router.push("/myaccount/diary");
          toast.success("Diary added successfull", {
            position: "top-right",
          });
        } else {
          toast.success(`Page ${diaryPage} added successfull`, {
            position: "top-right",
          });
          setDiaryPage(diaryPage + 1);
          setPublishDate(publishDate);
        }
        setDiaryContent("");
        setErrorMessage("");
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

  const [isGobackModel, setIsGobackModel] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (featuredImageUrl) openFeatureImageModal()
  }, [featuredImageUrl])



  const getMinDate = () => {
    if (!storePublishDate) {
      // No storePublishDate present, so minDate is today
      return new Date();
    }

    const now = new Date();

    // If storePublishDate is in the past or today, use today's date
    if (new Date(storePublishDate) <= now) {
      return now;
    }

    // If storePublishDate is in the future, use it as the minimum date
    return new Date(storePublishDate);
  };

  const [modalSize, setModalSize] = useState("35%");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalSize("90%");
      }
      else {
        setModalSize("35%");
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-1.5">
        <nav className="w-full text-black/40 flex items-center justify-between pb-3 border-b relative z-0 mb-3">
          <p className="font-semibold text-[16px] 2xl:text-[20px] text-black">
            New Diary
          </p>
          <Button
            onClick={() => setIsGobackModel(true)}
            className="flex border !rounded-full px-4 py-1.5 text-[14px] 2xl:text-[16px] !bg-white !text-black items-center justify-center"
          >
            <IconArrowLeft width={18} height={18} /> Back
          </Button>
        </nav>
        <div className="grid grid-cols-5 gap-x-3">
          <div className="mb-6 md:col-span-2 col-span-5">
            <div className="grid grid-cols-1 gap-2">
              <p className="font-bold text-[14px] 2xl:text-[20px] 2xl:font-semibold">
                Diary Type
              </p>
              {diaryPage !== 1 ? (
                <p> {diaryType === "Individual" ? "Individual Diary" : "Group Diary"}</p>
              ) : (
                <div className="flex gap-x-3 2xl:text-[20px]">
                  <div className="flex gap-x-1">
                    <input
                      type="radio"
                      placeholder="Individual"
                      checked={diaryType === "Individual"}
                      onChange={() => onDiaryTypeChange("Individual")}
                      readOnly={diaryPage !== 1}
                      className="cursor-pointer"
                    />
                    <p>
                      <span className="md:hidden">Individual</span>
                      <span className="hidden md:inline">Individual Diary</span>
                    </p>
                  </div>
                  <div className="flex gap-x-1">
                    <input
                      type="radio"
                      placeholder="Group"
                      checked={diaryType === "Group"}
                      onChange={() => onDiaryTypeChange("Group")}
                      readOnly={diaryPage !== 1}
                      className="cursor-pointer"
                    />
                    <p>
                      <span className="md:hidden">Group</span>
                      <span className="hidden md:inline">Group Diary</span>
                    </p>
                  </div>
                  <div className="flex gap-x-1">
                    <input
                      type="radio"
                      placeholder="Subscription"
                      checked={diaryType === "Subscription"}
                      onChange={() => onDiaryTypeChange("Subscription")}
                      readOnly={diaryPage !== 1}
                      className="cursor-pointer"
                    />
                    <p>
                      <span className="md:hidden">Subscription</span>
                      <span className="hidden md:inline">Subscription Diary</span>
                    </p>
                  </div>
                </div>
              )}

              {diaryPage === 1 ? (
                <Select
                  data={categories}
                  placeholder="Select Category"
                  label="Category"
                  labelClass="2xl:text-[20px] 2xl:font-semibold"
                  value={selectedCategory}
                  selectWrapperClass="2xl:py-3 2xl:text-[20px] !shadow-none"
                  onChange={onCategorySelect}
                  error={selectedCategoryError}
                />
              ) : (
                <>
                  <p className="font-bold text-[16px]">Category</p>
                  <p>{selectedCategorylable}</p>
                </>
              )}
              <Textinput
                label="Diary Name"
                labelClassName="2xl:text-[20px] 2xl:font-semibold"
                inputClassName="2xl:py-3 2xl:text-[20px]"
                placeholder="Enter Diary Name"
                value={diaryName}
                onChange={onDiaryNameChange}
                error={diaryNameError}
                inputProps={{ readOnly: diaryPage !== 1 }}
              />
              {croppedImage ? (
                <div className="w-[100%] h-full relative">
                  <h1 className="text-sm !font-bold font-sans mb-2">
                    Featured Image
                  </h1>
                  <div className="w-[100%] min-h-56 relative border border-gray-300 rounded-md overflow-hidden">
                    <Image
                      src={croppedImage}
                      alt="Preview"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  {diaryPage === 1 && (
                    <button
                      onClick={featuredImageRemove}
                      className="mt-2 bg-red-500 text-xs text-white px-3 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>

              ) : (
                <Fileinput
                  label="Featured Image"
                  accept="image/*"
                  labelClassName="text-sm !font-bold font-sans !text-[#000] 2xl:text-[20px] 2xl:!font-semibold"
                  multiple={false}
                  value={featuredImage}
                  error={featuredImageError}
                  clearable
                  onChange={updateFeaturedImage}
                  className="border p-2 rounded-md w-full 2xl:py-3 2xl:text-[20px]"
                  inputProps={{ readOnly: diaryPage !== 1 }}
                />
              )}

              <p className="font-bold text-[14px] 2xl:text-[20px] 2xl:font-semibold">
                Privacy
              </p>
              {diaryPage !== 1 ? (
                <p> {isPrivate ? "Private" : "Public"}</p>
              ) : (
                <div className="flex gap-x-3 2xl:text-[20px]">
                  <div className="flex gap-x-1">
                    <input
                      type="radio"
                      placeholder="Public"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                      readOnly={diaryPage !== 1}
                      className="cursor-pointer"
                    // disabled={diaryType === "Group"}
                    />
                    <span>Public</span>
                  </div>
                  <div className="flex gap-x-1">
                    <input
                      type="radio"
                      placeholder="Private"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                      readOnly={diaryPage !== 1}
                      className="cursor-pointer"
                      disabled={diaryType === "Subscription"}
                    />
                    <span>Private</span>
                  </div>
                </div>
              )}
              {
                diaryType === "Subscription" &&
                <div className="bg-[#044093] p-2 rounded-md">
                  <p className="text-white text-[14px] 2xl:text-[26px]">
                    By default, the first page of the diary is visible for free. From the second page onward, users need to subscribe to access the diary.
                  </p>
                </div>
              }

              <Datepicker
                label="Publish Date"
                value={publishDate}
                onChange={updatePublishDate}
                error={publishDateError}
                minDate={getMinDate()}
                labelClassName="2xl:text-[20px] 2xl:font-semibold"
                inputClassName="2xl:py-3 2xl:text-[20px]"
              />
            </div>
          </div>
          <div className="mb-6 md:col-span-3 col-span-5 md:mt-0 mt-4 z-0">
            {/* <Richtexteditor
              value={diaryContent}
              onChange={onContentChange}
            /> */}
            <Richtexteditor
              value={diaryContent}
              onChange={onContentChange}
            />
            {diaryContentError && (
              <p className="text-red-500 text-[16px]">{diaryContentError}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-x-4 mb-4">
          <button
            onClick={() => submitDiary(true)}
            className="px-4 py-2 rounded-md cursor-pointer bg-[#000] text-white hover:bg-black/80 2xl:text-[20px]"
          >
            Submit and Close
          </button>
          <button
            onClick={() => submitDiary(false)}
            className="px-4 py-2 rounded-md cursor-pointer bg-[#044093] text-white hover:bg-[#044093]/90 2xl:text-[20px]"
          >
            Submit and Add Page
          </button>
        </div>
      </div>
      {isLoadingEffect && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}

      {errorMessage && <Errorpanel errorMessages={errorMessage} />}

      {isGobackModel && (
        <DeleteModal
          open={isGobackModel}
          title="Are you sure!"
          message={
            diaryPage === 1
              ? "If you go back, your changes will not be saved!"
              : "If you go back, current page will not be saved!"
          }
          onConfirm={() => {
            setIsLoadingEffect(true);
            router.push("/myaccount/diary");
          }}
          onCancel={() => setIsGobackModel(false)}
          onClose={() => setIsGobackModel(false)}
          DeleteText="Goback"
        />
      )}

      <Modal
        open={featureImageModal}
        size={modalSize}
        onClose={closeFeatureImageModal}
        withCloseButton={false}
        margin="0px"
        padding="0px"
      >
        {featureImageModal && (
          <CropImage image={featuredImageUrl} onClose={closeFeatureImageModal} setCroppedImage={setCroppedImage} />
        )}
      </Modal>
    </>
  );
}

export default Adddiary;
