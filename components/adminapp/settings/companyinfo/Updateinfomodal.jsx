'use client'
import Settingsapi from '@/components/api/Settingsapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { Button, Card, Group, Loadingoverlay, NumberInput, Text, Textinput } from '@nayeshdaggula/tailify';
import { IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function Updateinfomodal({ closeGenralinfoModal, companyInfo, reloadCompanydetailsInfo }) {
    const access_token = useEmployeDetails(state => state.access_token);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [companyName, setCompanyName] = useState(companyInfo?.name ? companyInfo.name : '');
    const [companyNameError, setCompanyNameError] = useState('')
    const updateCompanyName = (e) => {
        setCompanyName(e.currentTarget.value)
        setCompanyNameError('')
    }

    const [email, setEmail] = useState(companyInfo?.email ? companyInfo.email : '');
    const [emailError, setEmailError] = useState('')
    const updateEmail = (e) => {
        setEmail(e.currentTarget.value)
        setEmailError('')
    }

    const [phone, setPhone] = useState(companyInfo?.phone ? companyInfo.phone : '');
    const [phoneError, setPhoneError] = useState('');
    const upatePhone = (e) => {
        setPhone(e.currentTarget.value);
        setPhoneError('');
        if (e.target.value.length > 10) {
            setPhoneError('Please enter a valid phone number');
            return false;
        }
    }

    const [addressone, setAddressone] = useState(companyInfo?.address_line1 ? companyInfo.address_line1 : '');
    const [addressoneError, setAddressoneError] = useState('');
    const updateAddressone = (e) => {
        setAddressone(e.currentTarget.value);
        setAddressoneError('');
    }

    const [addresstwo, setAddresstwo] = useState(companyInfo?.address_line2 ? companyInfo.address_line2 : '');
    const [addresstwoError, setAddresstwoError] = useState('');
    const updateAddresstwo = (e) => {
        setAddresstwo(e.currentTarget.value);
        setAddresstwoError('');
    }

    const [city, setCity] = useState(companyInfo?.city ? companyInfo.city : '');
    const [cityError, setCityError] = useState('');
    const updateCity = (e) => {
        setCity(e.currentTarget.value);
        setCityError('');
    }

    const [state, setState] = useState(companyInfo?.state ? companyInfo.state : '');
    const [stateError, setStateError] = useState('');
    const updateState = (e) => {
        setState(e.currentTarget.value);
        setStateError('');
    }

    const [country, setCountry] = useState(companyInfo?.country ? companyInfo.country : '');
    const [countryError, setCountryError] = useState('');
    const updateCountry = (e) => {
        setCountry(e.currentTarget.value);
        setCountryError('');
    }

    const [pincode, setPincode] = useState(companyInfo?.zip_code ? companyInfo.zip_code : '');
    const [pincodeError, setPincodeError] = useState('');
    const updatePincode = (value) => {
        setPincode(value);
        setPincodeError('');
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (companyName === '') {
            setIsLoadingEffect(false);
            setCompanyNameError('Enter company name');
            return false;
        }
        if (email === '') {
            setIsLoadingEffect(false);
            setEmailError('Enter email');
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsLoadingEffect(false);
            return false;
        }

        if (phone === '') {
            setIsLoadingEffect(false)
            setPhoneError('Enter phone number')
            return false
        }

        if (phone.length < 10) {
            setIsLoadingEffect(false)
            setPhoneError('Phone number must be 10 digits')
            return false
        }

        if (phone?.length > 10) {
            setIsLoadingEffect(false);
            setPhoneError('Please enter a valid phone number');
            return false;
        }

        if (addressone === '') {
            setIsLoadingEffect(false)
            setAddressoneError('Enter address')
            return false
        }

        if (city === '') {
            setIsLoadingEffect(false)
            setCityError('Enter city')
            return false
        }

        if (state === '') {
            setIsLoadingEffect(false)
            setStateError('Enter state')
            return false
        }

        if (country === '') {
            setIsLoadingEffect(false)
            setCountryError('Enter country')
            return false
        }

        if (pincode === '') {
            setIsLoadingEffect(false)
            setPincodeError('Enter pincode')
            return false
        }

        Settingsapi.post('updatecompanyinfo', {
            company_name: companyName,
            email: email,
            phone: phone,
            addressone: addressone,
            addresstwo: addresstwo,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
        }
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Company information Updated Successfully");
                setIsLoadingEffect(false);
                reloadCompanydetailsInfo();
                closeGenralinfoModal();
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

    return (
        <>
            <Card withBorder={false} padding='0' className='relative'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-2'>
                        <p className="font-semibold text-[18px]">Update Information</p>
                        <Button onClick={closeGenralinfoModal} color='#044093'>
                            <IconX size={16} />
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className='h-fit max-h-[80vh] overflow-auto !px-1 !py-2'>
                    <div className='mb-3 grid grid-cols-1'>
                        <Textinput
                            placeholder='Enter Company Name'
                            label="Company Name"
                            w={"100%"}
                            value={companyName}
                            error={companyNameError}
                            onChange={updateCompanyName}
                        />
                    </div>
                    <div className='md:flex-row mb-3 gap-4 grid grid-cols-2'>
                        <div className="flex flex-col">
                            <label className='text-[14px] font-semibold mb-1'>Phone Number</label>
                            <div className="flex flex-row items-center gap-2 w-full">
                                <div className='basis-[16%]'>
                                    <Textinput
                                        labelClassName='font-xs'
                                        value={"+91"}
                                        disabled
                                        inputProps={{ readOnly: true }}
                                        opacity={1}
                                    />
                                </div>
                                <div className='basis-[84%]'>
                                    <Textinput
                                        placeholder='Enter Phone Number'
                                        type='number'
                                        value={phone}
                                        onChange={upatePhone}
                                    />
                                </div>
                            </div>
                            {phoneError !== '' && <Text color="red" size="xs" mt={2}>{phoneError}</Text>}
                        </div>
                        <Textinput
                            placeholder='Enter Email'
                            label="Email"
                            w={'100%'}
                            value={email}
                            error={emailError}
                            onChange={updateEmail}
                        />
                    </div>
                    <div className='flex-col md:flex-row mb-3 gap-4 grid grid-cols-2'>
                        <Textinput
                            placeholder='Enter Address'
                            label="Address Line 1"
                            w={'100%'}
                            value={addressone}
                            error={addressoneError}
                            onChange={updateAddressone}
                        />
                        <Textinput
                            placeholder='Enter Address'
                            label="Address Line 2"
                            w={'100%'}
                            value={addresstwo}
                            error={addresstwoError}
                            onChange={updateAddresstwo}
                        />
                    </div>
                    <div className='flex-col md:flex-row mb-3 gap-4 grid grid-cols-2'>
                        <Textinput
                            placeholder='Enter City'
                            label="City"
                            w={'100%'}
                            value={city}
                            error={cityError}
                            onChange={updateCity}
                        />
                        <Textinput
                            placeholder='Enter State'
                            label="State"
                            w={'100%'}
                            value={state}
                            error={stateError}
                            onChange={updateState}
                        />
                    </div>
                    <div className='flex-col md:flex-row mb-3 gap-4 grid grid-cols-2'>
                        <Textinput
                            placeholder='Enter Country'
                            label="Country"
                            w={'100%'}
                            value={country}
                            error={countryError}
                            onChange={updateCountry}
                        />
                        <NumberInput
                            placeholder='Enter Zip Code'
                            label="Zip Code"
                            w={'100%'}
                            value={pincode}
                            error={pincodeError}
                            onChange={updatePincode}
                            hideControls
                        />
                    </div>
                </Card.Section>
                <Card.Section padding='0' className='pt-3 items-center'>
                    <button onClick={handleSubmit} disabled={isLoadingEffect} className="flex justify-end px-6 ml-auto text-[14px] bg-[#044093] text-white py-2 rounded cursor-pointer">Update</button>
                </Card.Section>
                {
                    isLoadingEffect &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                }
            </Card>
            {errorMessage !== '' &&
                <Errorpanel errorMessages={errorMessage} />
            }
        </>
    )
}

export default Updateinfomodal