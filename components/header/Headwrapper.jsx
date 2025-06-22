"use client";
import React, { useEffect, useState } from "react";
import {
  IconArrowNarrowRight,
  IconArrowRight,
  IconBell,
  IconMenu,
  IconMenu2,
  IconMenu3,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";
import dynamic from "next/dynamic";
import {
  Button,
  Drawer,
  Loadingoverlay,
  Modal,
  Text,
} from "@nayeshdaggula/tailify";
import Loginwrapper from "../auth/Loginwrapper";
import Registerwrapper from "../auth/Registerwrapper";
import { useRouter } from "next/navigation";
import { useUserDetails } from "../zustand/useUserDetails";
import { useCompanyinfo } from "../zustand/useCompanyinfo";
import Notificationapi from "../api/Notificationapi";


const Mainnavigation = dynamic(() => import("./Mainnavigation"));

function Headwrapper({ isLoggedCookie, uuid }) {
  const company_info = useCompanyinfo((state) => state.company_info);
  const isLogged = useUserDetails((state) => state.isLogged);
  const userInfo = useUserDetails((state) => state.user_info);
  const resetAuthdetails = useUserDetails((state) => state.resetAuthDetails);

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [loginModal, setLoginModal] = useState(false);
  const checkIsLogged = isLoggedCookie ? isLoggedCookie : isLogged;

  // const isMobile = useMediaQuery("(max-width: 640px)");
  // const drawerSize = isMobile ? "100%" : "45%";
  // const modalSize = isMobile ? "100%" : "35%";

  const openLoginModal = () => {
    setLoginModal(true);
    closeMobileMenu();
    closeRegisterModal();
  };

  const closeLoginModal = () => {
    setLoginModal(false);
  };

  const [registerModal, setRegisterModal] = useState(false);
  const openRegisterModal = () => {
    setRegisterModal(true);
    closeMobileMenu();
    closeLoginModal();
  };
  const closeRegisterModal = () => {
    setRegisterModal(false);
  };

  const [mobilemenu, setMobileMenu] = useState(false);
  const openMobileMenu = () => {
    setMobileMenu(true);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const handleResetUser = async () => {
    setIsLoadingEffect(true);
    try {
      const response = await fetch("/cookiesapi/deletecookies", {
        method: "POST",
      });

      const data = await response.json();

      if (data.status === "success") {
        router.push("/");
        closeMobileMenu();
        resetAuthdetails();
        setIsLoadingEffect(false);
        return false;
      } else {
        console.error("Error logging out:", data);
        setIsLoadingEffect(false);
        return false;
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoadingEffect(false);
      return false;
    }
  };

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [totalNotifications, setTotalNotifications] = useState(0);
  const navigateToNotifications = () => {
    if (totalNotifications > 0) {
      markNotificationAsread();
    }
    router.push("/myaccount/dashboard?notifications=true");
  };

  const getUnreadNotificationCount = (uuid) => {
    Notificationapi.get("/getunreadnotificationcount", {
      params: {
        user_uid: uuid,
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
          setErrorMessage(finalresponse);
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
        setErrorMessage(finalresponse);
        return false;
      });
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
          setErrorMessage(finalresponse);
          return false;
        }
        return false;
      })
      .catch((error) => {
        console.log(error);
        let finalresponse = {
          status: "error",
          message: error.message,
        };
        setErrorMessage(finalresponse);
        return false;
      });
  };

  useEffect(() => {
    getUnreadNotificationCount(uuid);
  }, [uuid]);


  const [modalSize, setModalSize] = useState("35%");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalSize("90%");
      }
      else {
        setModalSize("35%");
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`flex items-center justify-start gap-8 px-[3.3vw] w-full mx-auto h-fit py-[0.8vw] bg-[#FFFFFF] ${scrollY > 120 ? "sticky top-[0px] z-[99]" : ""
          }`}
      >
        <Link href="/">
          <Image
            src={company_info?.light_logo || logo}
            alt="LOGO"
            height={160}
            width={160}
            style={{ height: "auto", width: "auto" }}
            className="object-contain"
          />
        </Link>

        <div className="hidden lg:block">
          <Mainnavigation />
        </div>
        {checkIsLogged ? (
          <div className="ml-auto hidden lg:flex items-center gap-4 ">
            {/* <IconBell stroke={1.5} width={30} height={30} className='relative cursor-pointer' /> */}

            <div
              className="relative cursor-pointer"
              onClick={navigateToNotifications}
            >
              <IconBell stroke={1.5} width={30} height={30} />
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
            <Link
              href="/myaccount/dashboard"
              className="text-center font-inter text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[400]"
            >
              My Account
            </Link>
            <button
              onClick={handleResetUser}
              className="flex  items-center !bg-[#044093] text-white text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[500] h-9 px-4 rounded-sm cursor-pointer"
            >
              Logout <IconArrowNarrowRight stroke={2} width={18} height={24} />
            </button>
          </div>
        ) : (
          <div className="ml-auto hidden lg:flex space-x-[1.5vw]">
            <Button
              onClick={openLoginModal}
              className="font-inter text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] !bg-[#044093] !text-[#fff] font-[600]"
            >
              Login
            </Button>
            <Button
              onClick={openRegisterModal}
              className="font-inter text-[12px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] !bg-[#044093] !text-[#fff] px-[1.5vw] py-[0.5vw] rounded-[5px]"
            >
              Join Us Now
              <IconArrowRight size={24} className=" inline-block pl-[0.5vw]" />
            </Button>
          </div>
        )}
        <IconMenu2
          stroke={1.5}
          width={30}
          height={30}
          className="lg:hidden ml-auto bg-[#044093] text-white p-1 rounded-sm"
          onClick={openMobileMenu}
        />
      </div>

      <Modal
        open={loginModal}
        close={closeLoginModal}
        size={modalSize}
        padding="px-5"
        withCloseButton={false}
        containerClassName="w-[30%]"
        zIndex={9999}
      >
        {loginModal && (
          <Loginwrapper
            company_info={company_info}
            openRegisterModal={openRegisterModal}
            closeLoginModal={closeLoginModal}
          />
        )}
      </Modal>

      <Modal
        open={registerModal}
        close={closeRegisterModal}
        size={modalSize}
        padding="p-6"
        withCloseButton={false}
        zIndex={9999}
      >
        {registerModal && (
          <Registerwrapper
            company_info={company_info}
            openLoginModal={openLoginModal}
            closeRegisterModal={closeRegisterModal}
          />
        )}
      </Modal>
      <Drawer
        size='80%'
        padding="5%"
        // position="top"
        overlayProps={{ backgroundOpacity: 0.2 }}
        bg={"transparent"}
        zIndex={9999999999}
        open={mobilemenu}
        withCloseButton={false}
        closeOnClickOutside={true}
      >
        {mobilemenu && (
          <>
            <div className="flex flex-row items-center justify-between shadow-md mb-4 mt-5 sm:mt-0 px-2">
              <Link href="/">
                <Image
                  src={company_info?.light_logo || logo}
                  alt="LOGO"
                  height={160}
                  width={160}
                  style={{ height: "auto", width: "auto" }}
                  className="object-contain"
                />
              </Link>
              <IconX
                onClick={closeMobileMenu}
                color="#040993"
                className="cursor-pointer pr-2"
                size={25}
              />
            </div>
            <Mainnavigation
              checkIsLogged={checkIsLogged}
              handleResetUser={handleResetUser}
            />
            {checkIsLogged ? (
              <div className="flex flex-col mx-4 items-center gap-y-4 mt-6">
                <Link
                  href="/myaccount/dashboard"
                  className="flex items-center justify-center h-11 w-full text-center font-inter text-[#044093] hover:text-[#fff] text-[16px] md:text-[14px] font-[600] border-[0.8px] border-[#044093] hover:bg-[#044093] rounded-md"
                >
                  My Account
                </Link>
                <button
                  onClick={handleResetUser}
                  className="h-11 flex items-center justify-center w-full font-inter text-[16px] md:text-[14px] !bg-[#044093] !rounded-md !text-[#fff] font-[600]"
                >
                  Logout{" "}
                  <IconArrowNarrowRight stroke={2} width={18} height={24} />
                </button>
              </div>
            ) : (
              <div className="mx-4 space-y-4 flex flex-col mt-6">
                <Button
                  variant="default"
                  onClick={openLoginModal}
                  className="font-inter text-[12px] md:text-[14px] !border-[#044093] !rounded-[2px] !text-[#044093] font-[600]"
                >
                  Login
                </Button>
                <Button
                  onClick={openRegisterModal}
                  className="font-inter text-[12px] md:text-[14px] !bg-[#044093] !rounded-[2px] !text-[#fff] font-[600]"
                >
                  Join Us Now{" "}
                  <IconArrowNarrowRight
                    className="hidden md:flex"
                    stroke={2}
                    width={18}
                    height={24}
                  />
                </Button>
              </div>
            )}
          </>
        )}
      </Drawer>
      {isLoadingEffect && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}
    </>
  );
}

export default Headwrapper;
