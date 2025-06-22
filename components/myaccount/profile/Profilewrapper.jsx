"use client";
import Userapi from "@/components/api/Userapi";
import Errorpanel from "@/components/shared/Errorpanel";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import config from "@/config";
import {
  Button,
  Card,
  Fileinput,
  Loadingoverlay,
  Modal,
  Select,
  Textinput,
} from "@nayeshdaggula/tailify";
import { IconUser, IconX } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Editprofile from "./Editprofile";
import Changepassword from "./Changepassword";

function Profilewrapper() {
  const userInfo = useUserDetails((state) => state.user_info);

  const [isEditProfile, setIsEditProfile] = useState(false);
  const closeEditprofile = () => {
    setIsEditProfile(false);
  };

  const [isChangePassword, setIsChangePassword] = useState(false);
  const closeChangePasswordView = () => {
    setIsChangePassword(false);
  };

  /// Responsive Conditioning
  const [modalSize, setModalSize] = useState("70vw");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalSize("90vw");
      } else {
        setModalSize("40vw");
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="absolute px-1 sm:px-6 md:px-8 lg:px-10 w-full pb-8 mt-3">
        <Card className="!p-0">
          <Card.Section className="items-center grid grid-cols-2">
            <div className="gap-x-4 flex items-center md:col-span-1 col-span-2">
              <div className="bg-[#04409336] rounded-full overflow-hidden">
                {userInfo?.profile_pic ? (
                  <Image
                    width={75}
                    height={75}
                    src={userInfo?.profile_pic ? userInfo?.profile_pic : null} // You can dynamically insert user image here
                    alt="Profile"
                    className="w-[75px] h-[75px] 2xl:w-[120px] 2xl:h-[120px] object-cover"
                  />
                ) : (
                  <IconUser width={75} height={75} className="p-3" />
                )}
              </div>
              <div>
                <p className="text-black md:text-[20px] text-[16px] 2xl:text-[28px] font-semibold">
                  {userInfo?.name ? userInfo?.name : "-----"}
                </p>
                <p className="text-black 2xl:text-[24px]">
                  {userInfo?.email ? userInfo?.email : "-----"}
                </p>
              </div>
            </div>
            <div className="gap-x-4 flex justify-end md:col-span-1 col-span-2 md:mt-0 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsChangePassword(true)}
                className="bg-[#044093] md:font-semibold font-normal text-sm 2xl:text-[24px] hover:bg-[#044093] hover:text-white"
              >
                Change Password
              </Button>
              <Button
                onClick={() => setIsEditProfile(true)}
                className="bg-[#044093] md:font-semibold font-normal text-sm 2xl:text-[24px] px-6"
              >
                Edit
              </Button>
            </div>
          </Card.Section>
          <Card.Section className="grid grid-cols-2">
            <div>
              <p className="text-[16px] 2xl:text-[24px]">Phone Number</p>
              {userInfo?.phone_code && userInfo?.phone_number ? (
                <p className="font-semibold text-[14px] 2xl:text-[24px]">
                  +{userInfo?.phone_code} {userInfo?.phone_number}
                </p>
              ) : (
                <p className="font-semibold">-----</p>
              )}
            </div>
            <div>
              <p className="text-[16px] 2xl:text-[24px]">Gender</p>
              <p className="font-semibold text-[14px] 2xl:text-[24px]">
                {userInfo?.gender ? userInfo?.gender : "-----"}
              </p>
            </div>
          </Card.Section>
        </Card>
      </div>

      <Modal
        open={isEditProfile}
        size={modalSize}
        onClose={closeEditprofile}
        withCloseButton={false}
        margin="0px"
        padding="0px"
      >
        {isEditProfile && <Editprofile closeEditprofile={closeEditprofile} />}
      </Modal>

      <Modal
        open={isChangePassword}
        size={modalSize}
        onClose={closeChangePasswordView}
        withCloseButton={false}
        margin="0px"
        padding="0px"
      >
        {isChangePassword && (
          <Changepassword closeChangePasswordView={closeChangePasswordView} />
        )}
      </Modal>
    </>
  );
}

export default Profilewrapper;
