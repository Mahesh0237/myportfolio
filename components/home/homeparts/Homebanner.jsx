"use client";
import React from "react";
import home_banner from "@/public/assets/home_banner.png";
import { Button } from "@nayeshdaggula/tailify";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

function Homebanner({ isLoggedCookie }) {
  return (
    <div
      className="flex w-full h-fit py-4 pb-12 lg:py-0 lg:pb-0 lg:h-[95vh] bg-[#FFFFFF]"
      style={{
        backgroundImage: `url(${home_banner.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center -95px",
        backgroundRepeat: "no-repeat",
      }}
    ><style jsx>{`
      @media (max-width: 768px) {
        div[style] {
          background-position: center center !important;
        }
      }
    `}</style>
      <div className="flex flex-col gap-[2vh] px-[3.3vw] w-full mx-auto h-fit ">
        <p className="text-[22px] lg:text-[42px] 2xl:text-[44px] 3xl:text-[48px] 4xl:text-[52px] text-[#2B2B2B] !font-manrope font-[800] w-[60%] lg:w-[48%] pt-[4vw] lg:pt-[20vh] leading-tight">
          Welcome to your Personal Reflection, Diary Soul.
        </p>
        <p className="text-[#2B2B2B]/60 font-inter text-[12px] md:text-[16px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400] w-[60%] md:w-[45%]">
          Start making the mirror for your soul by joining us. To start writing
          your Diary, Signup. Diary Souls Team is always there for you to become
          an assistant for writing your Diary.
        </p>
        <div className="flex flex-row md:space-x-[1.5vw] mt-4 md:mt-0 gap-2 md:gap-0">
          {!isLoggedCookie &&
            <Link href={'/register'} className="w-fit !h-11 md:!h-fit flex items-center justify-center font-inter font-[500] text-[12px] md:text-[14px] 2xl:h-[15px] 3xl:text-[16px] 4xl:text-[17px] !bg-[#044093] !text-[#fff] px-[1.5vw] py-[0.5vw] rounded-[5px] border-[0.8px] border-[#044093]">
              Join Us Now
              <IconArrowRight size={24} className="inline-block pl-[0.5vw]" />
            </Link>}
          <Button className="!h-11 md:!h-fit w-fit font-inter font-[500] text-[12px] md:text-[14px] !bg-[#FFF] hover:!bg-[#044093] !text-[#2B2B2B] hover:!text-[#fff] !px-[1.5vw] !py-[0.5vw] rounded-[5px] border-[0.8px] border-[#2b2b2b]">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Homebanner;
