import React from "react";
import Image from "next/image";

function Professionalteamcard({ image, name, designation, experience }) {
  return (
    <div className="h-fit w-full space-y-[1vh]">
      <div className="h-[300px] w-full 2xl:h-[430px] overflow-hidden rounded-md bg-white">
        <Image
          src={image}
          alt="Poster image"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          width={500}
          height={300}
        />
      </div>
      <p className="text-[#2B2B2B] text-[19px] 2xl:text-[28px] md:text-[18px] md:font-[700] font-[600] capitalize">
        {name}
      </p>
      <p className="text-[#2B2B2B] text-[17px] md:text-[14px] font-[600] 2xl:text-[24px]">
        Designation: <span className="font-[400]">{designation}</span>
      </p>
      <p className="text-[#2B2B2B] text-[17px] md:text-[14px] font-[600] 2xl:text-[24px]">
        Experience: <span className="font-[400]">{experience ? `${experience} Years` : "N/A"} </span>
      </p>
    </div>
  );
}

export default Professionalteamcard;
