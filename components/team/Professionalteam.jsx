"use client";
import React, { useEffect, useState } from "react";
import Professionalteamcard from "./Professionalteamcard";
import Teamapi from "../api/Teamapi";
import SmallCardSkeleton from "./SmallCardSkeleton";

function Professionalteam() {
  const [usersdata, setUsersdata] = useState([]);
  const [totalusers, setTotalusers] = useState(0);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function getAllTeamMembers() {
    setIsLoadingEffect(true);
    await Teamapi.get("getallteammembersfrontend")
      .then((response) => {
        let data = response.data;
        console.log("API Response:", data);
        console.log("Team Data : ", usersdata);
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return;
        }
        setUsersdata(data.data);
        setTotalusers(data.totalCount);
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log(error);
        let finalresponse = {
          message: error.message,
          server_res: error.response?.data || null,
        };
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
      });
  }

  useEffect(() => {
    getAllTeamMembers();
  }, []);

  return (
    <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[1vh] flex flex-col">
      <p className="text-[#2B2B2B] text-[22px] md:text-[28px] md:font-[700] font-[600] text-center pb-[3vh] 2xl:text-[42px]">
        Latest Team Members
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoadingEffect ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SmallCardSkeleton key={index} />
          ))
        ) : usersdata.length > 0 ? (
          usersdata.map((member) => (
            <Professionalteamcard
              key={member.id}
              image={member.profile_image_url}
              name={member.name}
              designation={member.designation}
              experience={member.experience}
            />
          ))
        ) : (
          <div className="col-span-12 flex flex-row justify-center items-center ">
            <div className='w-[80%] md:w-[50%] mt-3 flex items-center justify-center h-[150px] bg-white border border-[#D7D8D9] rounded-md'>
              <p className='text-[#044093] text-[18px] xs:text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]'>No Team Members</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Professionalteam;
