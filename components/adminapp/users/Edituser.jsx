import Userapi from '@/components/api/Userapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { Button, Card, Loadingoverlay, Select, Textinput } from '@nayeshdaggula/tailify';
import { IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Edituser({ closeEditusermodal, singleuserUId, refreshUserData, countryCodes, setRefreshStatus }) {
    const access_token = useEmployeDetails(state => state.access_token);
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const upateFirstName = (e) => {
        setFirstName(e.target.value);
        setFirstNameError('');
    }

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const upateEmail = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    }

    const [phoneCode, setPhoneCode] = useState('');
    const updatePhoneCode = (value) => {
        setPhoneCode(value);
        setPhoneError('');
    }

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const upatePhone = (e) => {
        setPhone(e.target.value);
        setPhoneError('');
    }

    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');
    const updateGender = (value) => {
        setGender(value);
        setGenderError('');
    }

    const [errorMessage, setErrorMessage] = useState('')
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (firstName === '') {
            setFirstNameError('First Name is required');
            setIsLoadingEffect(false);
            return false;
        }
        if (email === '') {
            setEmailError('Email is required');
            setIsLoadingEffect(false);
            return false;
        }
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsLoadingEffect(false);
            return false;
        }
        if (phoneCode === '') {
            setPhoneError('Phone code is required');
            setIsLoadingEffect(false);
            return false;
        }
        if (phone === '') {
            setPhoneError('Phone number is required');
            setIsLoadingEffect(false);
            return false;
        }
        // Validate phone number
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setPhoneError('Please enter a valid phone number');
            setIsLoadingEffect(false);
            return;
        }
        if (gender === '') {
            setGenderError("Gender is required");
            setIsLoadingEffect(false);
            return false;
        }

        const userData = {
            first_name: firstName,
            email: email,
            phone_code: phoneCode,
            phone_number: phone,
            gender: gender,
            uuid: singleuserUId,
        };

        Userapi.post('updateusers', userData)
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
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
                setIsLoadingEffect(false);
                closeEditusermodal();
                refreshUserData();
                setRefreshStatus(true);
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
    };

    async function getDirectSingleUserEdit(singleUuid) {
        Userapi.get('/getsingleuserdata', {
            params: {
                single_user_uid: singleUuid
            },
            headers: {
                "Content-Type": "application/json",
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
                if (data !== null) {
                    setFirstName(data?.user_details?.first_name || '');
                    setEmail(data?.user_details?.email || '');
                    setPhoneCode(`${data?.user_details?.phone_code || '91'}`);
                    setPhone(data?.user_details?.phone_number || '');
                    setGender(`${data?.user_details?.gender || ''}`);
                }
                setIsLoadingEffect(false);
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
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        setIsLoadingEffect(true)
        getDirectSingleUserEdit(singleuserUId);
    }, [singleuserUId]);

    return (
        <div className='relative'>
            <Card withBorder={false}>
                <Card.Section className='!px-0 !pt-0'>
                    <div className="flex justify-between items-center">
                        <p className="text-[#044093] text-[17px] max-sm:text-[17px] md:text-xl">Update User</p>
                        <Button onClick={closeEditusermodal} variant="transparent" className='!px-0 focus:outline-none border-none !cursor-pointer'>
                            <IconX size={20} color='#044093' />
                        </Button>
                    </div>
                </Card.Section>
                <Card.Section withBorder className="!px-0 !border-b-0">
                    <div className='grid grid-cols-2 gap-4 py-2'>
                        <div>
                            <Textinput
                                placeholder="Enter First Name"
                                inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                                label="First Name"
                                labelClassName='text-sm font-medium font-sans'
                                error={firstNameError}
                                value={firstName}
                                onChange={upateFirstName}
                            />
                        </div>
                        <div>
                            <Textinput
                                placeholder="Enter Email Address"
                                label="Email Address"
                                inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                                labelClassName=' text-sm font-medium font-sans'
                                w="50%"
                                error={emailError}
                                value={email}
                                onChange={upateEmail}
                            />
                        </div>
                        <div className='w-[100%]'>
                            <label className="block  text-sm font-medium font-sans pb-1">Phone Number</label>
                            <div className="flex flex-row gap-x-2 w-full mt-1">
                                <div className="w-[100px]">
                                    <Select
                                        data={countryCodes}
                                        placeholder='Select code'
                                        value={phoneCode}
                                        // error={roleError}
                                        inputClassName='focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0'
                                        className='!m-0 !p-0 w-12'
                                        dropdownClassName='option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto'
                                        onChange={updatePhoneCode}
                                    />

                                </div>
                                <div className="">
                                    <Textinput
                                        placeholder="Enter Phone Number"
                                        inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                                        value={phone}
                                        type="number"
                                        onChange={upatePhone}
                                    />
                                </div>
                            </div>
                            {phoneError !== '' && (
                                <p className="mt-2 text-xs text-red-600">{phoneError}</p>
                            )}

                        </div>
                        <div className='w-[100%]'>
                            <Select
                                label="Gender"
                                labelClassName=' text-sm font-medium font-sans'
                                data={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                error={genderError}
                                value={gender}
                                onChange={updateGender}
                                inputClassName='focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                                className='!m-0 !p-0'
                                dropdownClassName='option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#00AEEF] focus:outline-none'
                            />
                        </div>
                    </div>
                </Card.Section>
                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isLoadingEffect}
                    className="!flex !ml-auto !px-3 !text-[16px] !bg-[#044093] cursor-pointer !text-white !py-2"
                >
                    Update
                </Button>
            </Card>
            {
                isLoadingEffect &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                </div>
            }
            {
                errorMessage !== '' &&
                <Errorpanel
                    errorMessages={errorMessage}
                />
            }
        </div>
    );
}

export default Edituser;
