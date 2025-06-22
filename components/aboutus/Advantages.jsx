"use client";
import Image from "next/image";
import React from "react";
import advantages from "@/public/assets/advantages.png";
import advantages_stars from "@/public/assets/advantages_stars.svg";
import list_icon from "@/public/assets/list_icon.svg";
import { IconArrowRight } from "@tabler/icons-react";
import { useUserDetails } from "../zustand/useUserDetails";
import Link from "next/link";

function Advantages() {
  const isLogged = useUserDetails(state => state.isLogged);
  const linkHref = isLogged ? '/myaccount/diary' : '/register'
  return (
    <div className="px-[8vw] py-[8vh] w-full mx-auto bg-[#FAFAFA] space-y-[2vh] gap-[8%] flex items-center justify-center">
      <div className="w-full md:basis-[45%] hidden md:block space-y-[3vh] relative">
        <Image
          src={advantages}
          alt="Author image"
          className="w-fit h-[85vh] object-cover rounded-[256px]"
        />
        <Image
          src={advantages_stars}
          alt="Author image"
          className=" absolute right-0 top-0 w-fit h-fit object-cover rounded-[200px]"
        />
      </div>
      <div className="w-full md:basis-[50%] space-y-[3vh]">
        <p className=" capitalize text-[21px] md:text-[36px] text-[#141414] font-manrope md:font-[800] font-[600] leading-tight 2xl:text-[39px]">
          Experience the Dairy Souls Advantage{" "}
        </p>
        <p className="text-[#2B2B2B99] font-manrope text-[14px] md:text-[15px] font-[500] leading-5 2xl:text-[28px] 2xl:leading-12">
          Discover a platform designed to inspire creativity, protect your
          privacy, and make journaling effortless. With personalized tools,
          secure storage, and thoughtful features, Dairy Souls empowers you to
          express yourself freely and focus on what truly matters
        </p>
        <div className="grid grid-cols-2 gap-6 pb-4">
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[13px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Discover the Difference
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[13px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Designed for Your Journey{" "}
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[13px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Tools That Inspire Growth
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[13px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Features Tailored for You
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[12px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Tailored Services
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={list_icon}
              alt="list_icon"
              className="w-fit h-fit mr-2"
            />
            <p className="text-[#141414] font-manrope text-[12px] md:text-[16px] font-[600] 2xl:text-[26px]">
              Empowering Your Stories
            </p>
          </div>
        </div>
        <Link href={linkHref} className="font-inter text-[13px] md:text-[14px] !bg-[#044093] !text-[#fff] px-3 py-2 rounded-[5px] 2xl:text-[26px]">
          {isLogged ? 'Start Writing' : 'My Account'}
          <IconArrowRight size={20} className="inline-block pl-[0.5vw]" />
        </Link>
      </div>
    </div>
  );
}

export default Advantages;