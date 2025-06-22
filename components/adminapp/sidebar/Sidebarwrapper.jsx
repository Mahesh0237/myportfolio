"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";
import dashboard from "@/public/assets/dashboard.svg";
import dashboard_2b2b from "@/public/assets/dashboard_2b2b.svg";
import settings from "@/public/assets/settings.svg";
import settings_2b2b from "@/public/assets/settings_2b2b.svg";
import employees from "@/public/assets/employees.svg";
import employee_2b2b from "@/public/assets/employees_2b2b.svg";
import { usePathname, useRouter } from "next/navigation";
import users from "@/public/assets/users.svg";
import users_2b2b from "@/public/assets/users_2b2b.svg";
import sidebarlogo from "@/public/assets/sidebar_logo.png";
import { IconChevronLeft, IconChevronRight, IconHelpCircle, IconLogout, IconNotebook, IconSettings, IconUsersGroup } from "@tabler/icons-react";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import { useNavtoggle } from "@/components/zustand/useNavtoggle";

function Sidebarwrapper() {
  const updateNavToggle = useNavtoggle((state) => state.updateNavToggle);
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const resetAuthdetails = useEmployeDetails((state) => state.resetAuthDetails);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [settingsDropdown, setSettingDropdown] = useState(false);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "user":
        setIsUserDropdownOpen((prev) => !prev);
        setIsSidebarOpen(true);
        break;
      case "settings":
        setSettingDropdown((prev) => !prev);
        setIsSidebarOpen(true);
      default:
        break;
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSettingDropdown(false);
    setIsUserDropdownOpen(false);
    updateNavToggle();
  };

  const router = useRouter()

  const handleResetUser = async () => {
    setIsLoadingEffect(true)
    try {
      const response = await fetch('/cookiesapi/admincookies', {
        method: 'POST',
      });

      const data = await response.json();
      console.log('data in nav:', data);

      if (data.status === 'success') {
        setIsLoadingEffect(false)
        router.push('/admin');
        resetAuthdetails();
      } else {
        console.error('Error logging out:', data);
        setIsLoadingEffect(false);
        return false
      }
    } catch (error) {
      setIsLoadingEffect(false)
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Full screen loading overlay */}
      {isLoadingEffect && (
        <div className='fixed inset-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-[9999]'>
          <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
        </div>
      )}
      <div
        className={`fixed h-screen ${isSidebarOpen ? " w-[200px]" : " w-fit"
          } flex flex-col items-start  border-r border-r-[#9c9c9c80] space-y-6  
         `}
      >
        <div className={`pl-3 pt-5  w-full ${isSidebarOpen ? "border-b border-[#DBDBDB] pb-[13px]" : ""}`}>
          {isSidebarOpen ? (
            <Image src={logo} alt="logo" className="w-[120px] " />
          ) : (
            <Image src={sidebarlogo} alt="sidebarlogo" className="w-10 h-8 " />
          )}
        </div>
        <div className="flex flex-col items-start pl-3  gap-3 text-black pr-3">
          <Link
            href="/admin/dashboard"
            className={`flex flex-row items-center gap-3 h-9   ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/dashboard")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            <Image
              alt={"dashboard"}
              src={isActive("/admin/dashboard") ? dashboard : dashboard_2b2b}
              size={20}
            />
            {isSidebarOpen && <p className="text-sm">Dashboard</p>}
          </Link>
          <div
            onClick={() => toggleDropdown("user")}
            className={`cursor-pointer flex flex-row items-center justify-start h-9 ${isSidebarOpen ? " pl-4  w-full gap-3" : "px-3 w-fit  gap-1"
              } ${isActive("/admin/employees") ||
                isActive("/admin/employees/roles-permissions")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            <Image
              alt={"employees"}
              src={
                isActive("/admin/employees") ||
                  isActive("/admin/employees/roles-permissions")
                  ? employees
                  : employee_2b2b
              }
              size={20}
            />
            {isSidebarOpen && <p className=" text-sm">Employees</p>}
            <IconChevronRight
              size={16}
              stroke={2}
              color={
                isActive("/admin/employees") ||
                  isActive("/admin/employees/roles-permissions")
                  ? "#044093"
                  : "#2B2B2B"
              }
              className={`transform transition-transform ${isUserDropdownOpen ? "rotate-90" : "rotate-0"
                }`}
            />
          </div>
          {isUserDropdownOpen && (
            <div className="mt-0 ml-3 flex flex-col gap-2 pl-8">
              <Link
                href="/admin/employees"
                className={`text-[#2b2b2b] text-sm  ${isActive("/admin/employees") ? "text-[#044093] font-[500]" : ""
                  }`}
              >
                All employees
              </Link>
              <Link
                href="/admin/employees/roles-permissions"
                className={`text-[#2b2b2b] text-sm ${isActive("/admin/employees/roles-permissions")
                  ? "text-[#044093] font-[500]"
                  : ""
                  }`}
              >
                Roles & permisssions
              </Link>
            </div>
          )}
          <Link
            href="/admin/users"
            className={`flex flex-row items-center gap-3  h-9 ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/users")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            <Image
              alt={"users"}
              src={isActive("/admin/users") ? users : users_2b2b}
              size={20}
            />
            {isSidebarOpen && <p className=" text-sm">Users</p>}
          </Link>

          <Link
            href="/admin/diaries"
            className={`flex flex-row items-center gap-3  h-9 ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/diaries")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            {/* <Image alt={'users'} src={isActive('/admin/diaries') ?<IconNotebook size={20} />: <IconNotebook color='blue'/>} /> */}
            <div>
              {isActive("/admin/diaries") ? (
                <IconNotebook size={20} color="#044093" />
              ) : (
                <IconNotebook size={20} />
              )}
            </div>

            {isSidebarOpen && <p className=" text-sm">Diaries</p>}
          </Link>

          <Link
            href="/admin/team"
            className={`flex flex-row items-center gap-3  h-9 ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/team")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            {/* <Image alt={'users'} src={isActive('/admin/diaries') ?<IconNotebook size={20} />: <IconNotebook color='blue'/>} /> */}
            <div>
              {isActive("/admin/team") ? (
                <IconUsersGroup size={20} color="#044093" />
              ) : (
                <IconUsersGroup size={20} />
              )}
            </div>

            {isSidebarOpen && <p className=" text-sm">Team</p>}
          </Link>

          <Link
            href="/admin/enquiries"
            className={`flex flex-row items-center gap-3  h-9 ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/enquiries")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            {/* <Image alt={'users'} src={isActive('/admin/diaries') ?<IconNotebook size={20} />: <IconNotebook color='blue'/>} /> */}
            <div>
              {isActive("/admin/enquiries") ? (
                <IconHelpCircle size={20} color="#044093" />
              ) : (
                <IconHelpCircle size={20} />
              )}
            </div>

            {isSidebarOpen && <p className=" text-sm">Enquiries</p>}
          </Link>
          <Link
            href="/admin/settings"
            className={`flex flex-row items-center gap-3  h-9 ${isSidebarOpen ? " pl-4  w-full" : "px-3 w-fit "
              } ${isActive("/admin/settings")
                ? "bg-gradient-to-r from-[#044093]/20 to-[#044093]/0 text-[#044093] rounded-sm font-semibold"
                : "text-[#2b2b2b] font-medium"
              }`}
          >
            <div>
              {isActive("/admin/settings") ? (
                <IconSettings size={20} color="#044093" />
              ) : (
                <IconSettings size={20} />
              )}
            </div>

            {isSidebarOpen && <p className=" text-sm">Settings</p>}
          </Link>
        </div>
        {isSidebarOpen &&
          <button
            onClick={handleResetUser}
            className={`cursor-pointer ${isSidebarOpen ? " pl-4 " : "px-2"
              } pl-6 flex items-center justify-start gap-1  h-11 w-full  text-[16px] text-[#f00]`}
          >
            <IconLogout stroke={1.5} size={18} />
            <p>Logout</p>
          </button>
        }
        <button
          onClick={toggleSidebar}
          className="cursor-pointer absolute border border-[#DBDBDB] bg-[#F9F9F9] -right-3 -top-0 flex items-center justify-center w-6 h-6 rounded-sm"
        >
          {isSidebarOpen ? (
            <IconChevronLeft color="#8b8b8b" />
          ) : (
            <IconChevronRight color="#8b8b8b" />
          )}
        </button>
      </div>
    </>
  );
}

export default Sidebarwrapper;
