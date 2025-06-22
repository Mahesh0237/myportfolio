"use client";
import Image from "next/image";
import React from "react";
import why_chooseus from "@/public/assets/why_chooseus.png";
import { Button } from "@nayeshdaggula/tailify";
import privacy from "@/public/assets/privacy.svg";
import personalized from "@/public/assets/personalized_foryou.svg";
import effortless_writing from "@/public/assets/effortless_writing.svg";

function Whychooseus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA]">
      <div className="col-span-1 space-y-[1.8vh]">
        <Image src={why_chooseus} alt="why_chooseus" className=" h-[30vh] object-cover md:h-fit w-full" />
        <p className="text-[#2B2B2B] text-center md:text-start pt-[4vw] md:pt-0 font-manrope text-[16px] md:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[700] ">
          Why Choose us?
        </p>
        <p className="text-[#2B2B2B] text-center md:text-start font-manrope text-[16px] md:text-[16px] 2xl:text-[20px] 3xl:text-[22px] 4xl:text-[26px] font-[600]">
          Discover a secure, inspiring, and seamless space to write and reflect.
        </p>
        <p className="text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] font-[400]">
          Your thoughts deserve a private, safe space to flourish. Our platform
          ensures your entries remain secure and accessible only to you.
          <span className="block pt-[1.8vh]">
            Whether you're reflecting on your day, planning your goals, or
            simply jotting down ideas, our user-friendly tools and creative
            prompts make writing effortless and enjoyable.
          </span>
        </p>
        <Button className="!w-full md:!w-fit !h-11 md:!h-fit font-inter font-[500] !text-[16px] md:!text-[14px] 2xl:!text-[15px] 3xl:!text-[16px] 4xl:!text-[17px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] !px-[1.5vw] !py-[0.5vw] !rounded-[2px] !md:rounded-[5px] border-[0.8px] border-[#2b2b2b]">
          Read More
        </Button>
      </div>
      <div className="col-span-1 space-y-[3vh] md:pl-[4vw] lg:pl-[8vw] pt-[4vh] md:pt-[0] 2xl:my-auto">
        <div className="flex bg-[#FFF] rounded-md w-full h-fit p-[5%] space-x-[4%]">
          <Image
            src={privacy}
            alt="privacy"
            className="rounded-full h-fit w-fit p-3  bg-[#D9E9FF]"

          />
          <div className="space-y-[3%]">
            <p className="text-[#2B2B2B] font-manrope text-[16px] lg:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[700] ">
              Privacy You Can Trust
            </p>
            <p className="text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] font-[400]">
              Your thoughts deserve a private, safe space to flourish. Our
              platform ensures your entries remain secure and accessible only to
              you.
            </p>
          </div>
        </div>
        <div className="flex bg-[#FFF] rounded-md w-full h-fit p-[5%] space-x-[4%]">
          <Image
            src={effortless_writing}
            alt="effortless_writing"
            className="rounded-full h-fit w-fit p-3  bg-[#D9E9FF]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#2B2B2B] font-manrope text-[16px] lg:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[700] ">
              Effortless Writing Experience
            </p>
            <p className="text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] font-[400]">
              Enjoy intuitive tools, creative prompts, and a distraction-free
              interface designed for seamless journaling.
            </p>
          </div>
        </div>
        <div className="flex bg-[#FFF] rounded-md w-full h-fit p-[5%] space-x-[4%]">
          <Image
            src={personalized}
            alt="personalized_foryou"
            className="rounded-full h-fit w-fit p-3  bg-[#D9E9FF]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#2B2B2B] font-manrope text-[16px] lg:text-[20px] 2xl:text-[24px] 3xl:text-[28px] 4xl:text-[36px] font-[700] ">
              Personalized for You
            </p>
            <p className="text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] font-[400]">
              Customize themes, layouts, and organization to create a diary that
              reflects your unique style. Make it a space that truly feels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whychooseus;
