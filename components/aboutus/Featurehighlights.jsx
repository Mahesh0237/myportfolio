"use client";
import React from "react";
import features from "@/public/assets/features.png";
import { Button } from "@nayeshdaggula/tailify";
import { IconArrowRight } from "@tabler/icons-react";
import privacy from "@/public/assets/privacy_features.svg";
import creativity from "@/public/assets/creativity.svg";
import simplicity from "@/public/assets/simplicity.svg";
import community from "@/public/assets/community.svg";
import Image from "next/image";
import { useUserDetails } from "../zustand/useUserDetails";
import Link from "next/link";

function Featurehighlights() {
  const isLogged = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : 'register'
  return (
    <div
      className="px-[8vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[2vh] md:flex md:flex-row flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${features.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full md:basis-[50%] md:space-y-[3vh] space-y-[2.5vh] my-auto">
        <p className=" capitalize text-[20px] md:text-[40px] text-[#FFFFFF] font-manrope md:font-[700] font-[600] leading-tight 2xl:text-[40px]">
          What We Believe In
        </p>
        <p className="text-[#FFFFFF]/75 font-manrope text-[14.5px] md:text-[15px] font-[400] 2xl:text-[28px]">
          At Dairy Souls, we value privacy, creativity, and simplicity. Our
          mission is to empower individuals with a safe and accessible space to
          reflect, grow, and express themselves freely.
        </p>
        <Link href={linkHref} className="font-inter text-[13px] md:text-[14px] !bg-[#044093] !text-[#fff] px-3 py-2 rounded-[5px] mb-7 2xl:text-[27px]">
          Start Writing
          <IconArrowRight size={20} className="inline-block pl-[0.5vw]" />
        </Link>
      </div>

      <div className="flex flex-col w-full ml-auto md:basis-[40%] md:mt-1 mt-10">
        <div className="flex w-fit h-fit p-[5%] space-x-[6%]">
          <Image
            src={privacy}
            alt="privacy"
            className="rounded-xl md:h-fit md:w-fit p-[14px] h-15 w-15 2xl:h-24 2xl:w-24 bg-[#FFB200]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#FFFFFF] font-manrope text-[16px] md:text-[20px] font-[600] md:leading-none leading-3 2xl:text-[28px]">
              Privacy
            </p>
            <p className="text-[#FFFFFF]/75 font-manrope text-[13px] md:text-[14px] font-[400] md:leading-6 leading-5 2xl:text-[22px] 2xl:leading-8">
              We prioritize the security of your thoughts.
            </p>
          </div>
        </div>
        <div className="flex w-fit h-fit p-[5%] space-x-[6%]">
          <Image
            src={creativity}
            alt="creativity"
            className="rounded-xl md:h-fit md:w-fit p-[14px] h-15 w-15 2xl:h-24 2xl:w-24 bg-[#FFB200]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#FFFFFF] font-manrope text-[16px] md:text-[20px] font-[600]  md:leading-none leading-3 2xl:text-[28px]">
              Creativity
            </p>
            <p className="text-[#FFFFFF]/75 font-manrope text-[13px] md:text-[14px] font-[400] md:leading-6 leading-5 2xl:text-[22px] 2xl:leading-8">
              We celebrate self-expression by providing tools.
            </p>
          </div>
        </div>
        <div className="flex w-fit h-fit p-[5%] space-x-[6%]">
          <Image
            src={simplicity}
            alt="simplicity"
            className="rounded-xl md:h-fit md:w-fit h-15 w-15 2xl:h-24 2xl:w-24 p-[14px] bg-[#FFB200]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#FFFFFF] font-manrope text-[16px] md:text-[20px] font-[600]  md:leading-none leading-3 2xl:text-[28px]">
              Simplicity
            </p>
            <p className="text-[#FFFFFF]/75 font-manrope text-[13px] md:text-[14px] font-[400] md:leading-6 leading-5 2xl:text-[22px] 2xl:leading-8">
              Journaling should be effortless. Our platform is intuitive.
            </p>
          </div>
        </div>
        <div className="flex w-fit h-fit p-[5%] space-x-[6%]">
          <Image
            src={community}
            alt="community"
            className="rounded-xl md:h-fit md:w-fit h-15 w-15 2xl:h-24 2xl:w-24 p-[14px] bg-[#FFB200]"
          />
          <div className="space-y-[3%]">
            <p className="text-[#FFFFFF] font-manrope text-[16px] md:text-[20px] font-[600]  md:leading-none leading-3 2xl:text-[28px]">
              Community
            </p>
            <p className="text-[#FFFFFF]/75 font-manrope text-[13px] md:text-[14px] font-[400] md:leading-6 leading-5 2xl:text-[22px] 2xl:leading-8">
              We foster a sense of belonging by connecting like-minded
              individuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featurehighlights;
