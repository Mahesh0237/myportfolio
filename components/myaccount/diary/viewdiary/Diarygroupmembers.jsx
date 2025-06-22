import { Button } from '@nayeshdaggula/tailify';
import { IconChevronLeft, IconChevronRight, IconMessage2, IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react'
import profilephoto from '@/public/assets/author_1.svg'
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


function Diarygroupmembers({ diaryGroupMembres, diaryGroupMembresLoading, is_logged, user_uid }) {
    const router = useRouter();
    const handleChatClick = (user) => {
        router.push(
            `/myaccount/chats?userId=${user.id}&userName=${encodeURIComponent(
                user.name
            )}&userImage=${encodeURIComponent(user.profile_image || profilephoto)}`
        );
    };
    return (
        <div className='relative'>
            <p className="flex items-center justify-start text-[14px] font-semibold text-[#044093] 2xl:text-[28px] pb-2"><IconUsers size={16} className='mr-2' />Group Members</p>
            <div className="w-full">
                <Swiper
                    modules={[Navigation, Scrollbar]}
                    scrollbar={{
                        hide: false,
                    }}
                    loop={false}
                    spaceBetween={12}
                    slidesPerView="auto"
                    navigation={{
                        nextEl: '.custom-next-btn',
                        prevEl: '.custom-prev-btn',
                    }}
                    className="!pl-2"
                >
                    {
                        !diaryGroupMembresLoading ? (
                            diaryGroupMembres.length > 0 ? (
                                diaryGroupMembres.map((member, index) => (
                                    <SwiperSlide key={index} style={{ width: '200px' }}>
                                        <div className="flex items-center justify-center bg-[#f0f4ff] p-2 rounded-md shadow-sm w-full min-w-[200px] h-10">
                                            <Image
                                                src={member?.profile_image || profilephoto}
                                                alt={member?.name}
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                            <p className="text-[12px] font-medium text-[#044093] ml-2">{member?.name || 'N/A'}</p>
                                            {
                                                (is_logged && member?.uuid !== user_uid) &&
                                                <Button
                                                    className="flex !text-white text-[10px] !px-2 !py-[2px] !rounded-[md] ml-auto my-auto cursor-pointer bg-[#044093] 2xl:text-[28px] 2xl:px-8 2xl:mt-4"
                                                    onClick={() =>
                                                        handleChatClick({
                                                            id: member?.user_id,
                                                            name: member?.name,
                                                            profile_image: `${member?.profile_image || profilephoto.src}`,
                                                        })
                                                    }
                                                >
                                                    <IconMessage2 size={12} className='mr-1' /> Chat
                                                </Button>
                                            }
                                        </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <div className="flex items-center justify-center w-full p-4">
                                        <p className="text-[14px] text-gray-500">No members found</p>
                                    </div>
                                </SwiperSlide>
                            )
                        ) : (
                            <SwiperSlide>
                                <div className="flex items-center justify-center w-full p-4">
                                    <p className="text-[14px] text-gray-500">Loading members...</p>
                                </div>
                            </SwiperSlide>
                        )
                    }

                </Swiper>
                <div className="absolute -top-1 right-0 flex justify-between gap-2">
                    <button className="cursor-pointer flex items-center justify-center custom-prev-btn w-6 h-6 bg-[#044093] text-white  rounded-full hover:bg-[#022c5b]"><IconChevronLeft size={16} /></button>
                    <button className="cursor-pointer flex items-center justify-center custom-next-btn w-6 h-6 bg-[#044093] text-white  rounded-full hover:bg-[#022c5b]"><IconChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    )
}

export default Diarygroupmembers