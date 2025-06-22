"use client";
import { Button } from "@nayeshdaggula/tailify";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { useUserDetails } from "../zustand/useUserDetails";

function Letsstartwriting() {
  const isLogged = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : 'register'
 
  return (
    <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#044093] space-y-[2vh] flex flex-col items-center justify-center">
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 gap-6">
        <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[18px]">
          <p className="flex-grow-0 flex-shrink-0 md:text-5xl md:font-bold font-semibold text-[28px] text-center capitalize text-white 2xl:text-[44px]">
            Let's Get Started
          </p>
          <p className="flex-grow-0 flex-shrink-0 md:text-lg text-sm text-center text-white/75 2xl:text-[28px]">
            Join our growing community of diary enthusiasts today!
          </p>
        </div>
        <Link href={linkHref} className="font-inter text-[13px] md:text-[14px] !bg-[#FFB200] flex items-center !text-[#000] px-4 py-[0.5vw] rounded-[5px] 2xl:text-[24px]">
          {isLogged ? 'My Account': 'Join us Now'}
          <IconArrowRight
            size={24}
            color="#000"
            className="inline-block pl-[0.5vw] 2xl:h-10 2xl:w-10"
          />
        </Link>
      </div>
    </div>
  );
}

export default Letsstartwriting;
