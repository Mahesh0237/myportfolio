"use client";
import Image from "next/image";
import React from "react";
import get_yourstory from "@/public/assets/get_yourstory.png";
import { Button } from "@nayeshdaggula/tailify";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import Link from "next/link";

function Getyourstory() {
  const isLogged = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : '/register'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#044093] space-x-[4vw]">
      <div className="col-span-1 space-y-[1.8vh] my-auto text-center md:text-start">
        <p className="text-[#FFFFFF] font-manrope text-[16px] md:text-[24px] 2xl:text-[28px] 3xl:text-[32px] 4xl:text-[38px] font-[700] ">
          Get Your Story Written by Us
        </p>
        <p className="text-[#FFFFFF]/90 font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] font-[400] w-full md:w-[90%]">
          No time to pen down your memories? Don’t worry—we’ve got you covered!
          At DiarySouls, our dedicated team of writers is here to bring your
          story to life. Simply give us a call and share your experiences, and
          we’ll craft them into a beautifully written and professionally
          designed book, just for you.
          <span className="block pt-[1.8vh]">
            {" "}
            Your story, your words, our expertise. For more details, contact us
            at +91 9989 278 282 and let’s create something truly special
            together!
          </span>
        </p>
        <Link href={linkHref} className="flex items-center justify-center w-full md:w-fit h-11 md:h-fit font-[600] text-[16px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] bg-transparent hover:!bg-[#FFB200] !text-[#FFB200] hover:!text-[#040993] px-[1.5vw] py-[0.5vw] rounded-[5px] border-[0.8px] border-[#FFB200] xl:mt-[4vh]">
          Join us
        </Link>
      </div>
      <div className="col-span-1 pt-[4vh] md:pt-0">
        <Image
          src={get_yourstory}
          alt="get_yourstory"
          className="h-full w-full rounded-md"
        />
      </div>
    </div>
  );
}

export default Getyourstory;
