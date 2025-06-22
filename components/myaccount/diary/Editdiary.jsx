'use client'
import Diariesapi from '@/components/api/Diariesapi';
import CropImage from '@/components/shared/CropImage';
import Errorpanel from '@/components/shared/Errorpanel';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import { Button, Card, Fileinput, Loadingoverlay, Modal, Select, Textinput } from '@nayeshdaggula/tailify'
import { IconArrowLeft, IconSignLeft, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function Editdiary({ closeEditdiarymodal, refreshSingleViewDairyData, openFeatureImageModal, closeFeatureImageModal, featuredImageUrl, setFeaturedImageUrl, croppedImage, setCroppedImage, featuredImageError, setFeaturedImageError, updateFeaturedImage, featuredImageRemove }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const user_id = userInfo?.user_id;

    const searchParams = useSearchParams();
    const router = useRouter();
    const diaryUid = searchParams.get('uid');

    const [categories, setCategories] = useState([]);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryError, setSelectedCategoryError] = useState('');
    const onCategorySelect = (value) => {
        setSelectedCategory(value);
        setSelectedCategoryError('');
    }
    const [diaryName, setDiaryName] = useState('');
    const [diaryNameError, setDiaryNameError] = useState('');
    const onDiaryNameChange = (e) => {
        setDiaryName(e.target.value);
        setDiaryNameError('');
    }
    const [isPrivate, setIsPrivate] = useState(false);
    const [diaryType, setDiaryType] = useState("Individual");
    const onDiaryTypeChange = (value) => {
        setDiaryType(value);
        if (value === "Group") {
            setIsPrivate(true);
        }
    }

    const getCategories = () => {
        setIsLoadingEffect(true);
        Diariesapi.get('/getcategories')
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setErrorMessage('');
                setCategories(data.categories);
                setIsLoadingEffect(false);
                return false;
            }).catch((error) => {
                const finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }

    const submitDiary = async () => {
        setIsLoadingEffect(true);
        if (selectedCategory === '' || selectedCategory === null) {
            setSelectedCategoryError('Please select a category');
            setIsLoadingEffect(false);
            return false;
        }
        if (diaryName === '' || diaryName === null) {
            setDiaryNameError("Please enter diary name");
            setIsLoadingEffect(false);
            return false;
        }
        if (featuredImageUrl === "" || featuredImageUrl === null) {
            setFeaturedImageError('Featured Image is required');
            setIsLoadingEffect(false);
            return false;
        }

        let cropedImagefile = null;
        if (featuredImageUrl) {
            const response = await fetch(featuredImageUrl);
            const blob = await response.blob();
            const randomNum = Math.floor(Math.random() * 1000000);
            const fileExtension = blob.type.split('/')[1];
            const randomFileName = `cropped-image-${randomNum}.${fileExtension}`;

            cropedImagefile = new File([blob], randomFileName, { type: blob.type });
        }

        const formdata = new FormData();

        formdata.append('selectedCategory', selectedCategory);
        formdata.append('diaryName', diaryName);
        formdata.append('featuredImage', cropedImagefile);
        formdata.append('isPrivate', isPrivate);
        // formdata.append("diaryType", diaryType);
        formdata.append('user_id', user_id);
        formdata.append('diaryUid', diaryUid);
        formdata.append('featuredImageUrl', featuredImageUrl);

        Diariesapi.post('/editdiary', formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                // router.push('/myaccount/diary');
                setErrorMessage('');
                toast.success("Diary updated successfully", {
                    position: "top-right"
                });
                closeEditdiarymodal();
                setCroppedImage('');
                closeFeatureImageModal()
                refreshSingleViewDairyData();
                setIsLoadingEffect(false)
                return false;
            })
            .catch((error) => {
                const finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }

    const getSingleDiaryData = (diaryUid) => {
        setIsLoadingEffect(true);
        Diariesapi.get('/getsinglediarydataforedit', {
            params: {
                diaryUid: diaryUid
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        status: 'error',
                        message: data.message
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setErrorMessage('');
                const diaryDetails = data?.diaryDetails;
                setSelectedCategory(diaryDetails?.category_id);
                setDiaryName(diaryDetails?.diaryName);
                setIsPrivate(diaryDetails?.isPrivate);
                setFeaturedImageUrl(diaryDetails?.featuredImageUrl);
                setDiaryType(diaryDetails?.diaryType);
                setIsLoadingEffect(false);
                return false;
            }).catch((error) => {
                const finalresponse = {
                    status: 'error',
                    message: error.message
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            })
    }

    useEffect(() => {
        getCategories();
        getSingleDiaryData(diaryUid);
    }, [])

    useEffect(() => {
        if (croppedImage) openFeatureImageModal()
    }, [croppedImage])

    return (
        <>
            <Card padding='0' margin='0' className='w-[100%] !rounded-none '>
                <Card.Section className='!p-0 !py-2'>
                    <div className="flex justify-between items-center px-4">
                        <p className="text-[#044093] font-bold text-xl md:text-[20px] max-sm:text-[17px] 2xl:text-[32px] 2xl:font-semibold">Edit diary</p>
                        <Button
                            variant='default'
                            onClick={closeEditdiarymodal} className="cursor-pointer !border-0 rounded-full transition duration-200 ease-in-out">
                            <IconX size={20} color='#044093' />
                        </Button>
                    </div>
                </Card.Section>
                <Card.Section className='!p-0'>
                    <div className="w-full z-10 h-[calc(100vh-270px)] overflow-y-auto">
                        <div className="grid grid-cols-1 gap-2 p-4">
                            <div className='flex flex-col gap-1 '>
                                <div className='flex flex-row items-center gap-2'>
                                    <p className='font-bold text-[14px] 2xl:text-[28px] 2xl:font-semibold'>Diary Type:</p>
                                    <p className='text-[14px] 2xl:text-[20px]'>{diaryType}</p>
                                </div>
                                {/* <div className='flex gap-x-3'>
                                {
                                    diaryType !== "Group" && (
                                        <div className='flex gap-x-1'>
                                            <input
                                                type="radio"
                                                placeholder='Individual'
                                                checked={diaryType === "Individual"}
                                                onChange={() => onDiaryTypeChange("Individual")}
                                            />
                                            <p className='text-[14px] 2xl:text-[22px]'>Individual Diary</p>
                                        </div>
                                    )
                                }
                                {
                                    diaryType !== "Individual" && (
                                        <div className='flex gap-x-1'>
                                            <input
                                                type="radio"
                                                placeholder='Group'
                                                checked={diaryType === "Group"}
                                                onChange={() => onDiaryTypeChange("Group")}
                                            />
                                            <p className='text-[14px] 2xl:text-[22px]'>Group Diary</p>
                                        </div>
                                    )
                                }
                                <div className="flex gap-x-1">
                                    <input
                                        type="radio"
                                        placeholder="Subscription"
                                        checked={diaryType === "Subscription"}
                                        onChange={() => onDiaryTypeChange("Subscription")}
                                        className="cursor-pointer"
                                    />
                                    <span>Subscription Diary</span>
                                </div>
                            </div> */}
                            </div>
                            <Select
                                data={categories}
                                placeholder='Select Category'
                                label='Category'
                                labelClass='2xl:text-[28px] 2xl:font-semibold'
                                selectWrapperClass='2xl:text-[24px] 2xl:mb-6 !shadow-none'
                                dropDownListClass='2xl:text-[24px]'
                                value={selectedCategory}
                                onChange={onCategorySelect}
                                error={selectedCategoryError}
                            />
                            <Textinput
                                label='Diary Name'
                                placeholder='Enter Diary Name'
                                labelClassName='2xl:text-[28px] 2xl:font-semibold'
                                inputClassName='2xl:text-[24px] 2xl:mb-6'
                                value={diaryName}
                                onChange={onDiaryNameChange}
                                error={diaryNameError}
                            />


                            {featuredImageUrl ? (
                                <div className="w-[100%] h-full relative">
                                    <h1 className="text-sm !font-bold font-sans mb-2">
                                        Featured Image
                                    </h1>
                                    <div className="w-[100%] min-h-56 relative border border-gray-300 rounded-md overflow-hidden">
                                        <Image
                                            src={featuredImageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-contain object-center"
                                        />
                                    </div>
                                    <Button
                                        onClick={featuredImageRemove}
                                        className="absolute top-2 right-2 bg-red-500 text-xs text-white stroke-2 !p-1 !rounded-full"
                                    >
                                        <IconX size={10} strokeWidth={2} color='#fff' />
                                    </Button>
                                </div>

                            ) : (
                                <Fileinput
                                    label="Featured Image"
                                    accept="image/*"
                                    labelClassName="text-sm !font-bold font-sans !text-[#000] 2xl:text-[26px] 2xl:!font-semibold"
                                    multiple={false}
                                    value={croppedImage}
                                    error={featuredImageError}
                                    clearable
                                    onChange={updateFeaturedImage}
                                    className="border p-2 rounded-md w-full 2xl:py-3 2xl:text-[22px]"
                                // inputProps={{ readOnly: diaryPage !== 1 }}
                                />
                            )}
                            {
                                (diaryType === "Individual" || diaryType === "Group") ?
                                    <div className='flex flex-col gap-1 '>
                                        <p className='font-bold text-[14px] 2xl:text-[28px] 2xl:font-semibold'>Privacy</p>
                                        <div className='flex gap-x-3'>
                                            <div className='flex gap-x-1'>
                                                <input
                                                    type="radio"
                                                    placeholder='Public'
                                                    checked={!isPrivate}
                                                    onChange={() => setIsPrivate(false)}
                                                />
                                                <p className='text-[14px] 2xl:text-[22px]'>Public</p>
                                            </div>
                                            <div className='flex gap-x-1'>
                                                <input
                                                    type="radio"
                                                    placeholder='Public'
                                                    checked={isPrivate}
                                                    onChange={() => setIsPrivate(true)}
                                                />
                                                <p className='text-[14px] 2xl:text-[22px]'>Private</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className='flex flex-row items-center gap-2'>
                                        <p className='font-bold text-[14px] 2xl:text-[28px] 2xl:font-semibold'>Diary Privacy:</p>
                                        <p className='text-[14px] 2xl:text-[20px]'>{isPrivate === true ? "Private" : "Public"}</p>
                                    </div>
                            }
                        </div>
                    </div>
                </Card.Section>
                <Card.Section className='!p-0 !py-2'>
                    <div className='flex justify-end items-center px-2 '>
                        <Button
                            onClick={submitDiary}
                            className="!flex justify-end !ml-auto !mx-3 !text-[14px] !bg-[#044093] !text-white !py-[6px] !px-6 border-0">
                            Submit
                        </Button>
                    </div>
                </Card.Section>
                {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} overlayBg='#2b2b2bcc' />}
                {errorMessage && <Errorpanel errorMessages={errorMessage} />}
            </Card >


        </>
    )
}

export default Editdiary;