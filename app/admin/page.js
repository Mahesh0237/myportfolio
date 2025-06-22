import Loginform from "@/components/adminapp/login/Loginform";
import React from "react";
import Image from "next/image";
import logo from '@/public/assets/logo.svg'

function page() {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-cover bg-center px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/assets/adminLoginBackgroundImage.jpg')" }}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-6">
                <Image src={logo} alt="LOGO" className='h-12 w-fit' />
                <h5 className="text-sm text-gray-500">Welcome back!</h5>
                <h3 className="text-xl font-semibold">Log In to your Account</h3>
                <Loginform />
            </div>
        </div>
    );
}

export default page;
