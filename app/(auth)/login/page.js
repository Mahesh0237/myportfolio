import Footerone from "@/components/footer/Footerone";
import Headwrapper from "@/components/header/Headwrapper";
import Topbarwrapper from "@/components/topbar/Topbarwrapper";
import React, { Suspense } from 'react'
import { cookies } from "next/headers";
import LoginPageform from "@/components/auth/LoginPageForm";
import { redirect } from "next/navigation";

async function page() {
    const cookieStore = await cookies();
    const isLoggedCookie = cookieStore.get("is_logged")?.value;
    const uuid = cookieStore.get('uuid')?.value;
    if (isLoggedCookie === "true") {
        redirect("/");
    }
    return (
        <Suspense>
            <Topbarwrapper />
            <Headwrapper isLoggedCookie={isLoggedCookie} uuid={uuid} />
            <div className="flex flex-col items-center justify-center py-[4vh] lg:py-[8vh] w-full bg-[#fafafa]">
                <p className="text-[24px] font-[600] text-black">Login</p>
                <div className=" px-[3.3vw] w-full lg:w-[40%]">
                    <LoginPageform />
                </div>
            </div>
            <Footerone />
        </Suspense>
    )
}

export default page