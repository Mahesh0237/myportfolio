"use client";
import React from "react";
import aboutusbanner from "@/public/assets/aboutus_banner.png";
import { Button } from "@nayeshdaggula/tailify";
function Teamsbanner() {
  return (
    <div
      className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[2vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${aboutusbanner.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "45vh",
      }}
    >
      <p className="md:text-[42px] text-[24px] text-[#FFFFFF] md:font-[800] font-[600] leading-tight">
        Meet the Team{" "}
      </p>
      <p className="text-[#FFFFFf]/60 font-manrope text-[14px] text-center md:text-[14px] font-[400] 2xl:text-[28px]">
        A passionate group of individuals dedicated to helping you express your
        thoughts and grow
      </p>
      <Button className="font-inter text-[13px] md:text-[14px] bg-white !text-black px-4 md:px-6 py-2 rounded-[5px] hover:bg-gray-100 transition-colors duration-200 2xl:text-[20px]">
        Learn More About Us
      </Button>
    </div>
  );
}

export default Teamsbanner;
