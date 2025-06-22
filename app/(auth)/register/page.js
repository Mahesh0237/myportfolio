import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import RegisterPageform from "@/components/auth/RegisterPageForm";
import { redirect } from "next/navigation";

const Headwrapper = dynamic(() => import("@/components/header/Headwrapper"));
const Footerone = dynamic(() => import("@/components/footer/Footerone"));
const Topbarwrapper = dynamic(() => import("@/components/topbar/Topbarwrapper"));

async function Page() {
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
            <div className="flex flex-col items-center justify-center py-[4vh] lg:py-[8vh] w-full bg-[#FAFAFA]">
                <p className="text-[24px] font-[600] text-black">Signup</p>
                <div className="px-[3.3vw] w-full lg:w-[40%]">
                    <RegisterPageform />
                </div>
            </div>
            <Footerone />
        </Suspense>
    );
}

export default Page;
