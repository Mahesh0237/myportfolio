'use client'
import Sidebarwrapper from "@/components/adminapp/sidebar/Sidebarwrapper";
import Topbarwrapper from "@/components/adminapp/topbar/Topbarwrapper";
import { useNavtoggle } from "@/components/zustand/useNavtoggle";

export default function DashboardLayoutwrapper({ children }) {
    const navToggle = useNavtoggle((state) => state.navToggle);
    return (

        <div className="flex">
            <div className="fixed h-screen border-r z-50 border-[#9c9c9c80] flex flex-col items-start space-y-6">
                <Sidebarwrapper />
            </div>
            <div className="flex flex-col w-full">
                <div className="fixed top-0 left-0 right-0 z-30 bg-white h-[70px] border-b border-[#DBDBDB] flex items-center justify-start">
                    <Topbarwrapper />
                </div>
                {/* <div className={`pt-[90px] h-screen overflow-y-auto px-4 ${navToggle ? 'ml-[200px]' : 'ml-[84px]'} `}> */}
                <div className={`mt-[70px] ${navToggle ? 'ml-[200px]' : 'ml-[84px]'} `}>
                    {children}
                </div>
            </div>
        </div>
    );
}