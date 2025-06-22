import Userapi from '@/components/api/Userapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useUserDetails } from '@/components/zustand/useUserDetails';
import config from '@/config';
import { Button, Card, Fileinput, Loadingoverlay, Select, Textinput } from '@nayeshdaggula/tailify'
import { IconX } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function Editprofile({ closeEditprofile }) {
    const userInfo = useUserDetails((state) => state.user_info);
    const access_token = useUserDetails((state) => state.access_token);
    const updateAuthDetails = useUserDetails(state => state.updateAuthDetails);
    const userId = userInfo?.user_id;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [userName, setUserName] = useState(userInfo?.name ? userInfo?.name : '');
    const [userNameError, setUserNameError] = useState('');
    const onNameChange = (e) => {
        setUserName(e.target.value);
        setUserNameError('');
    }

    const [profilePicUrl, setProfilePicUrl] = useState(userInfo?.profile_pic ? userInfo?.profile_pic : null);
    const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState(userInfo?.profile_pic ? userInfo?.profile_pic : null);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicError, setProfilePicError] = useState('');
    const updateProfilePic = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const blob = new Blob([file], { type: file.type });
        const fileUrl = URL.createObjectURL(blob);

        setProfilePic(file);
        setProfilePicPreviewUrl(fileUrl);
        setProfilePicUrl(null);
        setProfilePicError('');
    };
    const ProfilePicRemove = () => {
        setProfilePic(null);
        setProfilePicUrl(null);
        setProfilePicPreviewUrl(null);
    };

    const [userEmail, setUserEmail] = useState(userInfo?.email ? userInfo?.email : '');
    const [userEmailError, setUserEmailError] = useState('');
    const onEmailChange = (e) => {
        setUserEmail(e.target.value);
        setUserEmailError('');
    }

    const [phoneCode, setPhoneCode] = useState(userInfo?.phone_code ? userInfo?.phone_code : '');
    const [phoneNumber, setPhoneNumber] = useState(userInfo?.phone_number ? userInfo?.phone_number : '');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const onPhoneChange = (e) => {
        setPhoneNumber(e.target.value);
        setPhoneNumberError('')
        if (e.target.value.length > 10) {
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
    }

    const [gender, setGender] = useState(userInfo?.gender ? userInfo?.gender : '');
    const [genderError, setGenderError] = useState('');
    const onGenderChange = (value) => {
        setGender(value);
        setGenderError('');
    }

    const hasChanges = () => {
        return (
            profilePic !== null || // if a new file is selected
            profilePicUrl !== userInfo?.profile_pic ||
            userName !== userInfo?.name ||
            userEmail !== userInfo?.email ||
            phoneNumber !== userInfo?.phone_number ||
            gender !== userInfo?.gender
        );
    };

    const SubmitEditProfile = (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (!profilePic && !profilePicUrl) {
            setProfilePicError('Profile picture is required');
            setIsLoadingEffect(false);
            return;
        }
        if (!userName) {
            setUserNameError("Name is required");
            setIsLoadingEffect(false);
            return;
        }
        if (!userEmail) {
            setUserEmailError("Email is required");
            setIsLoadingEffect(false);
            return;
        }
        if (!phoneNumber) {
            setPhoneNumberError("Phone Number is required");
            setIsLoadingEffect(false);
            return;
        }
        if (phoneNumber?.length !== 10) {
            setIsLoadingEffect(false);
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
        if (phoneNumber?.length > 10) {
            setIsLoadingEffect(false);
            setPhoneNumberError('Please enter a valid phone number');
            return false;
        }
        if (!gender) {
            setGenderError("Gender is required");
            setIsLoadingEffect(false);
            return;
        }

        if (
            profilePicUrl === userInfo?.profile_pic &&
            userName === userInfo?.name &&
            userEmail === userInfo?.email &&
            phoneNumber === userInfo?.phone_number &&
            gender === userInfo?.gender
        ) {
            closeEditprofile();
            setIsLoadingEffect(false);
            return false;
        }

        const formdata = new FormData();
        if (profilePicUrl) {
            formdata.append('profilePicUrl', profilePicUrl);
        } else {
            formdata.append('profilePic', profilePic);
        }
        formdata.append('userName', userName);
        formdata.append('userEmail', userEmail);
        formdata.append('userPhoneNumber', phoneNumber);
        formdata.append('userGender', gender);
        formdata.append('userId', userId);

        Userapi.post('updateprofile', formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setIsLoadingEffect(false);
                    return;
                }
                setErrorMessage('');
                const app_url = config.main_url;
                updateAuthDetails(data.user_details, access_token);
                const url = `${app_url}/cookiesapi/setcookies/`;
                const body = {
                    access_token: access_token,
                    is_logged: true,
                    uuid: data.user_details.uuid,
                    user_type: data.user_details.user_type
                };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(cookiedata => {
                        if (cookiedata.status === 'success') {
                            setUserName(data.user_details.name);
                            setProfilePicUrl(data.user_details.profile_pic);
                            setUserEmail(data.user_details.email);
                            setPhoneNumber(data.user_details.phone_number);
                            setGender(data.user_details.gender);
                            closeEditprofile();
                            setIsLoadingEffect(false);
                            return true;
                        } else {
                            let finalresponse = {
                                'status': 'error',
                                'message': cookiedata.message,
                                'server_res': null
                            }
                            setErrorMessage(finalresponse)
                            setIsLoadingEffect(false);
                            return false;
                        }
                    })
                    .catch(error => {
                        setErrorMessage({
                            message: error.message,
                            server_res: error
                        })
                        setIsLoadingEffect(false);
                        return false;
                    });
            })
            .catch((error) => {
                setErrorMessage({
                    message: error.message,
                    server_res: error.response?.data || null,
                });
                setIsLoadingEffect(false);
                return false;
            });
    };


    useEffect(() => {
        if (userInfo) {
            setUserName(userInfo?.name ? userInfo?.name : '');
            setProfilePicUrl(userInfo?.profile_pic ? userInfo?.profile_pic : null);
            setProfilePicPreviewUrl(userInfo?.profile_pic ? userInfo?.profile_pic : null);
            setUserEmail(userInfo?.email ? userInfo?.email : '');
            setPhoneCode(userInfo?.phone_code ? userInfo?.phone_code : '');
            setPhoneNumber(userInfo?.phone_number ? userInfo?.phone_number : '');
            setGender(userInfo?.gender ? userInfo?.gender : '');
        }
    }, [userInfo]);

    useEffect(() => {
        setIsButtonDisabled(!hasChanges());
    }, [profilePic, profilePicUrl, userName, userEmail, phoneNumber, gender]);

    return (
        <>
            <Card padding='0px'>
                <Card.Section className='flex justify-between items-center !p-2'>
                    <p className='font-semibold text-[18px] 2xl:text-[32px]'>Edit Profile</p>
                    <IconX onClick={closeEditprofile} size={20} className='cursor-pointer' />
                </Card.Section>
                <Card.Section className='gap-y-2 flex flex-col max-h-[70vh] overflow-y-auto'>
                    {profilePicPreviewUrl ? (
                        <div className='flex flex-row items-center gap-2'>
                            <p className='font-bold text-[14px] 2xl:text-[24px] 2xl:font-normal'>Profile Image:</p>
                            <div className="relative w-[80px] h-[80px] 2xl:w-[120px] 2xl:h-[120px] ">
                                <Image
                                    width={80}
                                    height={80}
                                    src={profilePicPreviewUrl}
                                    alt="Profile"
                                    className=" object-cover rounded-sm"
                                />
                                <div onClick={ProfilePicRemove} className='absolute top-0 right-0 bg-[#044093] rounded-full p-1 cursor-pointer'>
                                    <IconX size={14} color='white' />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Fileinput
                            label={'Profile Image'}
                            labelClassName=""
                            multiple={false}
                            value={profilePic}
                            error={profilePicError}
                            clearable
                            onChange={updateProfilePic}
                            className="border p-4 rounded-md w-full"
                        />
                    )}
                    <Textinput
                        label='Name'
                        placeholder='Enter name'
                        labelClassName='2xl:text-[24px] 2xl:!font-normal'
                        value={userName}
                        onChange={onNameChange}
                        error={userNameError}
                        inputClassName='focus:!border-[#d1d5dc] bg-white 2xl:text-[22px]'
                    />
                    <Textinput
                        label='Email'
                        labelClassName='2xl:text-[24px] 2xl:!font-normal'
                        placeholder='Enter email'
                        value={userEmail}
                        onChange={onEmailChange}
                        error={userEmailError}
                        inputClassName='focus:!border-[#d1d5dc] bg-white 2xl:text-[22px]'
                    />
                    <div className="flex flex-col space-y-1 w-full">
                        <p className='font-bold text-[14px] mb-2 2xl:text-[24px] 2xl:font-normal'>Phone Number</p>
                        <div className={`flex flex-row justify-start rounded-sm h-10 pl-2 border border-[#e0e0e0]`}>
                            <input
                                className="border-r border-r-[#e0e0e0] focus:outline-none md:p-1 mr-2 2xl:text-[22px]"
                                type="text"
                                id="phonecode"
                                value={`+${phoneCode}`}
                                readOnly
                                style={{ width: "10%" }}
                            />
                            <input
                                className="focus:outline-none p-2 2xl:text-[22px]"
                                placeholder='Enter Phone Number'
                                type="number"
                                min={0}
                                id="phonenumber"
                                value={phoneNumber}
                                onChange={onPhoneChange}
                                style={{ width: "92%" }}
                            />
                        </div>
                        {phoneNumberError && <p className='text-[#FF0000] text-[14px] font-[400]'>{phoneNumberError}</p>}
                    </div>
                    <Select
                        data={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" }
                        ]}
                        label='Gender'
                        labelClass='!mb-2 2xl:text-[24px] 2xl:!font-normal'
                        value={gender}
                        error={genderError}
                        onChange={onGenderChange}
                        selectWrapperClass='2xl:text-[22px] !shadow-none !bg-[#fff]'
                        dropDownListClass='2xl:text-[22px]'
                    />
                </Card.Section>
                <Card.Section className='flex justify-end !p-2'>
                    <Button onClick={SubmitEditProfile} disabled={isLoadingEffect || isButtonDisabled} className={`bg-[#044093] ${(isLoadingEffect || isButtonDisabled) ? "!cursor-not-allowed opacity-50" : ""} 2xl:text-[24px] px-6`}>
                        Submit
                    </Button>
                </Card.Section>
            </Card >
            {
                isLoadingEffect &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                </div>
            }
            {errorMessage && <Errorpanel errorMessages={errorMessage} />}
        </>
    )
}

export default Editprofile