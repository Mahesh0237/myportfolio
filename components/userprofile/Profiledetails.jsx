'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import maleprofile from '@/public/assets/maleprofile.png'
import femaleprofile from '@/public/assets/femaleprofile.png'
import { Button, Card, Loadingoverlay } from '@nayeshdaggula/tailify'
import { useUserDetails } from '../zustand/useUserDetails'
import { IconMessage2 } from '@tabler/icons-react'
import Userdiaries from './Userdiaries'
import Diariesapi from '../api/Diariesapi'
import Errorpanel from '../shared/Errorpanel'
import { useRouter } from 'next/navigation'
import profilephoto from "@/public/assets/dummy-user-image.png";

function Profiledetails({ useruid }) {
    const router = useRouter();
    const isLogged = useUserDetails((state) => state.isLogged);
    const user_info = useUserDetails((state) => state.user_info)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userdetails, setUserdetails] = useState({})
    const getUserdetails = () => {
        setIsLoading(true)
        Diariesapi.get("/getuserdetails", {
            params: {
                user_uid: useruid
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        status: "error",
                        message: data.message,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoading(false)
                    return false;
                }
                setIsLoading(false)
                setErrorMessage("");
                setUserdetails(data?.userdetails || {});
                return false;
            })
            .catch((error) => {
                console.log('Error:', error);
                setIsLoading(false)
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

    useEffect(() => {
        getUserdetails()
    }, [useruid])

    const handleChatClick = (user) => {
        router.push(
            `/myaccount/chats?userId=${user.id}&userName=${encodeURIComponent(
                user.name
            )}&userImage=${encodeURIComponent(user.profile_image || profilephoto)}`
        );
    };

    return (
        <div className='px-[3.3vw] py-[8vh] w-full bg-[#FAFAFA] space-y-[2vh]'>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
                <div className='basis-[100%] md:basis-[25%] '>
                    {/* <h1 className="text-[20px] font-bold mb-[6px] text-[#2b2b2b] leading-6 tracking-[0.5px] 2xl:text-[24px] text-center"
                    >
                        User Profile
                    </h1> */}
                    <Card className="!px-0 !py-4 relative">
                        <Card.Section className='!p-2 flex flex-col justify-center items-center gap-3'>
                            <div className="rounded-lg overflow-hidden ">
                                <Image
                                    src={userdetails?.profile_pic || (userdetails?.gender === "Female" ? femaleprofile : maleprofile)}
                                    alt="profile"
                                    className="object-cover"
                                    height={150}
                                    width={150}
                                />
                            </div>
                            <div className='text-center space-y-1'>
                                <p className="text-black  text-[16px] font-semibold">
                                    {userdetails?.name}
                                </p>
                                <p className="text-black">
                                    {userdetails?.email}
                                </p>
                                {
                                    (isLogged && parseInt(userdetails?.user_id) !== parseInt(user_info?.user_id)) &&
                                    <Button
                                        size='md'
                                        className="!text-[12px] !rounded-md ml-auto !bg-[#044093] text-white 2xl:!text-[20px] mt-2"
                                        onClick={() =>
                                            handleChatClick({
                                                id: userdetails?.user_id,
                                                name: userdetails?.name,
                                                profile_image: `${userdetails?.profile_pic || profilephoto.src}`,
                                            })
                                        }
                                    >
                                        <IconMessage2 color="#fff" className="mr-[4px]" size={16} />
                                        Chat
                                    </Button>
                                }
                            </div>
                        </Card.Section>
                        {
                            isLoading &&
                            <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                                <Loadingoverlay visible={isLoading} overlayBg='' />
                            </div>
                        }
                    </Card>
                    {
                        errorMessage !== '' &&
                        <Errorpanel
                            errorMessages={errorMessage}
                        />
                    }
                </div>
                <div className='basis-[100%] md:basis-[75%]'>
                    <div className='relative h-[calc(100vh-160px)] overflow-y-auto pr-[10px]'>
                        <Userdiaries
                            useruid={useruid}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profiledetails