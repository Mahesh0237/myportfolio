import Image from 'next/image';
import React from 'react';

// Customer Review Card Component
function Customerreviewcard({ rating, reviewtext, customer_profile, customer_name, customer_desg }) {
    return (
        <div className='bg-[#F4F4F4] rounded-lg p-6 w-full' >
            <div className='flex flex-col gap-4'>
                {rating}
                <p className='text-[#2B2B2B] md:text-xs text-[14px] 2xl:text-[28px]'>
                    {reviewtext}
                </p>
                <div className='flex items-center gap-4 mt-auto'>
                    <Image
                        src={customer_profile}
                        height={40} width={40}
                        alt="profile"
                        className='2xl:h-25 2xl:w-25'
                    />
                    <div>
                        <p className='font-inter md:text-xs text-[15px] font-semibold text-[#2B2B2B] 2xl:text-[28px]'>
                            {customer_name}
                        </p>
                        <p className='font-inter md:text-xs text-[14px] font-normal text-[#141414BF] 2xl:text-[24px]'>
                            {customer_desg}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Customerreviewcard;