"use client";
import React from "react";
import aboutusbanner from "@/public/assets/aboutus_banner.png";
import { Button } from "@nayeshdaggula/tailify";
import { useUserDetails } from "../zustand/useUserDetails";
import Link from "next/link";
function Dairiesbanner() {
  const isLogged  = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : '/register';
  
return (
  <div
    className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[2vh] flex flex-col md:gap-0 gap-1 items-center justify-center"
    style={{
      backgroundImage: `url(${aboutusbanner.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "45vh",
    }}
  >
    <p className="md:text-[42px] text-[24px] text-[#FFFFFF] md:font-[800] font-[600] leading-tight">
      Your Diaries, Your Stories
    </p>
    <p className="text-[#FFFFFf]/60 font-manrope text-[14px] text-center md:text-[14px] font-[400] 2xl:text-[28px]">
      A secure and creative space to revisit your memories and track your
      growth.
    </p>
    <div className="flex md:space-x-[1.5vw] space-x-[2vw]">
      <Link
        href={linkHref}
        className="font-inter text-[13px] md:text-[14px] bg-white text-black px-[5vw] md:px-[2vw] py-[2vw] md:py-[0.5vw] rounded-[5px] hover:bg-gray-100 transition-colors duration-200 2xl:text-[24px]"
      >
        Start Writing Today
      </Link>
    </div>
  </div>
);
}

export default Dairiesbanner;
