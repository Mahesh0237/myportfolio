"use client";
import React, { useEffect, useState } from "react";
import logo from "@/public/assets/logo.svg";
import Image from "next/image";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import {
  IconArrowNarrowLeft,
  IconBell,
  IconLogout2,
  IconUser,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, Loadingoverlay, Menu, Text } from "@nayeshdaggula/tailify";
import Notificationapi from "@/components/api/Notificationapi";
import Recentnotifications from "../Recentnotifications";
import { useCompanyinfo } from "@/components/zustand/useCompanyinfo";
import Link from "next/link";


function MyAccountMainHeader({ user_uid }) {
  const company_info = useCompanyinfo((state) => state.company_info);
  const userInfo = useUserDetails((state) => state.user_info);
  const resetAuthdetails = useUserDetails((state) => state.resetAuthDetails);

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMeaaage] = useState("");

  // const isMobile = useMediaQuery("(max-width: 640px)");
  // const modalSize = isMobile ? "100%" : "70%";

  const handleResetUser = async () => {
    setIsLoadingEffect(true);
    try {
      const response = await fetch("/cookiesapi/deletecookies", {
        method: "POST",
      });

      const data = await response.json();

      if (data.status === "success") {
        router.push("/");
        resetAuthdetails();
      } else {
        console.error("Error logging out:", data);
      }
      setIsLoadingEffect(false);
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoadingEffect(false);
    }
  };

  const searchParams = useSearchParams();
  const notificationsparama = searchParams.get("notifications");

  const [totalNotifications, setTotalNotifications] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  const opennotificationsdrawer = () => {
    setOpenNotifications(true);
    if (totalNotifications > 0) {
      markNotificationAsread();
    }
  };
  const closeNotificationsDrawer = () => {
    setOpenNotifications(false);
  };

  const getUnreadNotificationCount = () => {
    Notificationapi.get("/getunreadnotificationcount", {
      params: {
        user_uid: user_uid,
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            status: "error",
            message: data.message,
          };
          setIsLoadingEffect(false);
          setErrorMeaaage(finalresponse);
          return false;
        }
        setTotalNotifications(data.notification_count);
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
        let finalresponse = {
          status: "error",
          message: error.message,
        };
        setIsLoadingEffect(false);
        setErrorMeaaage(finalresponse);
        return false;
      });
  };

  useEffect(() => {
    if (notificationsparama) {
      opennotificationsdrawer(true);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("notifications");
    router.replace(`?${params.toString()}`, { scroll: false });
    getUnreadNotificationCount();
  }, []);

  const reloadNotifications = () => {
    getUnreadNotificationCount();
  };

  const markNotificationAsread = () => {
    Notificationapi.post("/marknotificationasread", {
      user_id: userInfo?.user_id,
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            status: "error",
            message: data.message,
          };
          setIsLoading(false);
          setErrorMeaaage(finalresponse);
          return false;
        }
        reloadNotifications();
        return false;
      })
      .catch((error) => {
        console.log(error);
        let finalresponse = {
          status: "error",
          message: error.message,
        };
        setErrorMeaaage(finalresponse);
        return false;
      });
  };

  /// Responsive Conditioning
  const [modalSize, setModalSize] = useState("70vw");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalSize("100vw");
      } else {
        setModalSize("70vw");
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isLoadingEffect && (
        <div className="fixed inset-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-[9999]">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}
      <div className="w-full bg-white flex items-center justify-between px-4 sm:px-6 md:px-10 mt-5 sm:mt-0 h-14 sm:h-16 shadow">
        <Link href="/">
          <Image
            src={company_info?.light_logo || logo}
            alt="LOGO"
            height={160}
            width={160}
            className="object-contain h-[160px] w-[160px] max-sm:h-[160px] max-sm:w-[160px]"
          />
        </Link>
        <div className="flex flex-row items-center gap-2 sm:gap-5">
          <div className="hidden md:flex items-center gap-2 cursor-pointer">
            <a href="/" className="flex flex-row items-center gap-2">
              <IconArrowNarrowLeft />
              <button className="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#2b2b2b] cursor-pointer">
                Back to Home
              </button>
            </a>
          </div>
          <div
            className="relative cursor-pointer"
            onClick={opennotificationsdrawer}
          >
            <IconBell
              stroke={1.5}
              width={30}
              height={30}
              className="w-5 h-5 sm:w-7 sm:h-7"
            />
            {totalNotifications > 0 && (
              <Text className="absolute -top-1 -right-1 bg-[#044093] text-[10px] md:text-[10px] font-[400] px-1 py-0.5 rounded-full text-white">
                {totalNotifications > 99
                  ? 99 + "+"
                  : totalNotifications < 10
                  ? "0" + totalNotifications
                  : totalNotifications}
              </Text>
            )}
          </div>
            
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-6 w-6 xxm:h-8 xxm:w-8 xs:h-7 xs:w-7 sm:h-9 sm:w-9 rounded-full bg-amber-200 overflow-hidden">
                  {userInfo?.profile_pic ? (
                    <Image
                      width={75}
                      height={75}
                      src={userInfo?.profile_pic ? userInfo?.profile_pic : null} // You can dynamically insert user image here
                      alt="Profile"
                      className="h-6 w-6 xxm:h-8 xxm:w-8 xs:h-7 xs:w-7 sm:h-9 sm:w-9 object-cover"
                    />
                  ) : (
                    <IconUser width={"100%"} height={"100%"} className="p-1" />
                  )}
                </div>
                <h3 className="hidden xs:block text-[9px] xxm:text-[11px] sm:text-base font-medium text-gray-800">
                  {userInfo?.name || "User"}
                </h3>
              </div>
            </Menu.Target>

            <Menu.Dropdown className="ml-[-80px] sm:ml-[30px]">
              <Menu.Item>
                <a href="/myaccount/profile">
                  <div className="flex items-center gap-2">
                    <IconUser size={14} />
                    <span>Profile</span>
                  </div>
                </a>
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout2 size={14} />}
                onClick={handleResetUser}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Drawer
          padding="0px"
          open={openNotifications}
          onClose={closeNotificationsDrawer}
          size={modalSize}
          closeOnClickOutside={false}
          closeOnEscape={false}
          withCloseButton={false}
          zIndex={999}
        >
          {openNotifications && (
            <Recentnotifications
              closeNotificationsDrawer={closeNotificationsDrawer}
              reloadNotifications={reloadNotifications}
            />
          )}
        </Drawer>
      </div>
    </>
  );
}

export default MyAccountMainHeader;
