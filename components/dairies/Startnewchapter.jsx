"use client";
import { Button } from "@nayeshdaggula/tailify";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { useUserDetails } from "../zustand/useUserDetails";

function Startnewchapter() {
  const isLogged = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : 'register'
  return (
    <div className="px-[3.3vw] md:py-[12vh] py-8 w-full mx-auto h-fit bg-[#044093] space-y-[2vh] flex flex-col items-center justify-center">
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 gap-6">
        <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0  gap-[18px]">
          <p className="md:text-[42px] text-[22px] md:font-bold font-semibold text-center capitalize text-white md:w-[60%] w-full leading-tight">
            Start a new chapter in your story today.
          </p>
          <p className="text-[#FFFFFf]/75 font-manrope text-[14px] md:text-[16px] font-[400] 2xl:text-[32px]">
            Join our growing community of diary enthusiasts today!
          </p>
        </div>
        <Link href={linkHref} className="flex items-center font-inter text-[13px] md:text-[14px] !bg-[#FFB200] !text-[#000] px-4 py-2 rounded-[5px] 2xl:text-[26px]">
          {isLogged ? 'My Account ' : 'Join Us Now'}
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

export default Startnewchapter;
