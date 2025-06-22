"use client";
import React from "react";
import aboutusbanner from "@/public/assets/aboutus_banner.png";
import { Button } from "@nayeshdaggula/tailify";

function Contactusbanner() {
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
      <p className="md:text-[42px] text-[32px] text-[#FFFFFF] md:font-[800] font-[600] leading-tight">
        Contact us
      </p>
      <p className="text-[#FFFFFf]/60 font-manrope text-[16px] text-center md:text-[14px] font-[400] md:w-[60%] px-3 2xl:text-[24px]">
        We’d love to hear from you! Whether you have questions, feedback, or
        just want to connect, reach out to us and we’ll get back to you as soon
        as possible.{" "}
      </p>
    </div>
  );
}

export default Contactusbanner;
