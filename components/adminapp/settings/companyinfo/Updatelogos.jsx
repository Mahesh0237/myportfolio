import Settingsapi from '@/components/api/Settingsapi';
import Errorpanel from '@/components/shared/Errorpanel';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { Button, Card, Fileinput, Group, Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconTrash, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

function Updatelogos({ closeThemeUpdateModal, refreshThemeLogos, themelogos }) {
    const access_token = useEmployeDetails((state) => state.access_token);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showLightUrl, setShowLightUrl] = useState(themelogos?.light_logo ? themelogos.light_logo : null);
    const updateshowLightUrl = () => {
        setShowLightUrl(null);
        setIsButtonDisabled(false);
    }

    const [lightLogo, setLightLogo] = useState(null);
    const [lightLogoError, setLightLogoError] = useState('');
    const updateLightLogo = (e) => {
        const mainfile = e.target.files[0];
        setLightLogo(mainfile);
        setLightLogoError('');
    }

    const [showDarkUrl, setShowDarkUrl] = useState(themelogos?.dark_logo ? themelogos.dark_logo : null);
    const updateshowDarkUrl = () => {
        setShowDarkUrl(null);
        setIsButtonDisabled(false);
    }
    const [darkLogo, setDarkLogo] = useState(null);
    const [darkLogoError, setDarkLogoError] = useState('');
    const updateDarkLogo = (e) => {
        const mainfile = e.target.files[0];
        setDarkLogo(mainfile);
        setDarkLogoError('');
    }

    const [showFaviconUrl, setShowFaviconUrl] = useState(themelogos?.favicon ? themelogos.favicon : null);
    const updateshowFaviconUrl = () => {
        setShowFaviconUrl(null);
        setIsButtonDisabled(false);
    }
    const [favicon, setFavicon] = useState(null);
    const [faviconError, setFaviconError] = useState('');
    const updateFavicon = (e) => {
        const mainfile = e.target.files[0];
        setFavicon(mainfile);
        setFaviconError('');
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (!lightLogo && !showLightUrl) {
            setLightLogoError('Please upload light logo');
            setIsLoadingEffect(false);
            return false;
        }
        if (!darkLogo && !showDarkUrl) {
            setDarkLogoError('Please upload dark logo');
            setIsLoadingEffect(false);
            return false;
        }
        if (!favicon && !showFaviconUrl) {
            setFaviconError('Please upload favicon logo');
            setIsLoadingEffect(false);
            return false;
        }

        const formData = new FormData();
        if (lightLogo) {
            formData.append('lightlogo', lightLogo);
        } else {
            formData.append('lightlogoUrl', showLightUrl);
        }

        if (darkLogo) {
            formData.append('darklogo', darkLogo);
        } else {
            formData.append('darklogoUrl', showDarkUrl);
        }

        if (favicon) {
            formData.append('favicon', favicon);
        } else {
            formData.append('faviconUrl', showFaviconUrl);
        }

        Settingsapi.post('updatelogos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Logos Updated Successfully");
                refreshThemeLogos();
                setIsLoadingEffect(false);
                closeThemeUpdateModal();
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
                        <p className="font-semibold text-[18px]">Update Theme</p>
                        <Button onClick={closeThemeUpdateModal} color='#044093'>
                            <IconX size={16} />
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !px-1 !py-2">
                    <div className='gap-y-2 flex flex-col'>
                        {showLightUrl ?
                            <div>
                                <p className="text-sm pb-0.5 mb-0 font-medium">Light Logo</p>
                                <div className=' border border-black justify-between flex py-1 px-2 items-center rounded'>
                                    <Image src={showLightUrl} width={100} height={50} alt="light logo" className="w-11 h-11" />
                                    <button onClick={updateshowLightUrl}>
                                        <IconTrash color='red' stroke={1.5} />
                                    </button>
                                </div>
                            </div>
                            :
                            <Fileinput
                                label="Light Logo"
                                placeholder="Upload Light Logo"
                                accept="image/png,image/jpeg, image/jpg, image/svg+xml, image/webp"
                                className='w-full'
                                // rightSection={<IconPaperclip style={{ width: 25, height: 25 }} stroke={1.5} />}
                                // rightSectionPointerEvents="none"
                                // value={lightLogo}
                                onChange={updateLightLogo}
                                error={lightLogoError}
                            />
                        }
                        {showDarkUrl ?
                            <div>
                                <p className="text-sm pb-0.5 mb-0 font-medium">Dark Logo</p>
                                <div className=' border border-black justify-between flex py-1 px-2 items-center rounded'>
                                    <Image src={showDarkUrl} width={100} height={50} alt="light logo" className="w-11 h-11" />
                                    <button onClick={updateshowDarkUrl}>
                                        <IconTrash color='red' stroke={1.5} />
                                    </button>
                                </div>
                            </div>
                            :
                            <Fileinput
                                label="Dark Logo"
                                placeholder="Upload Dark Logo"
                                accept="image/png,image/jpeg, image/jpg, image/svg+xml, image/webp"
                                className='w-full'
                                // rightSection={<IconPaperclip style={{ width: 25, height: 25 }} stroke={1.5} />}
                                // rightSectionPointerEvents="none"
                                // value={darkLogo}
                                onChange={updateDarkLogo}
                                error={darkLogoError}
                            />
                        }
                        {showFaviconUrl ?
                            <div>
                                <p className="text-sm pb-0.5 mb-0 font-medium">Favicon</p>
                                <div className=' border border-black justify-between flex py-1 px-2 items-center rounded'>
                                    <Image src={showFaviconUrl} width={100} height={50} alt="light logo" className="w-11 h-11" />
                                    <button onClick={updateshowFaviconUrl}>
                                        <IconTrash color='red' stroke={1.5} />
                                    </button>
                                </div>
                            </div>
                            :
                            <Fileinput
                                label="Favicon"
                                placeholder="Upload Favicon"
                                accept="image/png,image/jpeg, image/jpg, image/svg+xml, image/webp"
                                className='w-full'
                                // rightSection={<IconPaperclip style={{ width: 25, height: 25 }} stroke={1.5} />}
                                // rightSectionPointerEvents="none"
                                // value={favicon}
                                onChange={updateFavicon}
                                error={faviconError}
                            />
                        }
                    </div>
                </Card.Section>
                <Card.Section padding='0' className='pt-3'>
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

export default Updatelogos