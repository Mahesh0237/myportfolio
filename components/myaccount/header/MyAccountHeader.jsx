"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import React from "react";
import MyAccountMainHeader from "./MyAccountMainHeader";

function MyAccountHeader({ user_uid }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => pathname.includes(path);
  const isDiaryActive = pathname.includes("/diary");

  const linkClass = (path) =>
    `block font-normal text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] py-2 ${isActive(path) ? "text-white" : "text-white/60"
    } `;

  return (
    <>
      <MyAccountMainHeader
        user_uid={user_uid}
      />
      <nav className="w-full bg-[#044093] text-white flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3 shadow-md z-[9999]">
        {/* Hamburger (mobile only) */}
        <div className="md:hidden">
          <IconMenu2
            className="w-6 h-6 cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />
        </div>

        {/* Left Side (desktop) */}
        <div className="hidden md:flex items-center gap-10 2xl:gap-15">
          <Link
            href="/myaccount/dashboard"
            className={linkClass("/myaccount/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            href="/myaccount/diary"
            className={linkClass("/myaccount/diary")}
          >
            My Diary
          </Link>

          <Link
            href="/myaccount/profile"
            className={linkClass("/myaccount/profile")}
          >
            Profile
          </Link>
          <Link
            href="/myaccount/chats"
            className={linkClass("/myaccount/chats")}
          >
            Chats
          </Link>
          <Link
            href="/myaccount/invitations"
            className={linkClass("/myaccount/invitations")}
          >
            Invitations
          </Link>
          <Link
            href="/myaccount/contribution-requests"
            className={linkClass("/myaccount/contribution-requests")}
          >
            Contribution Requests
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 bg-[#044093] text-white w-full xs:w-[50vw] h-full pt-10 p-6 shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <IconX
                className="w-5 h-5 cursor-pointer"
                onClick={() => setDrawerOpen(false)}
              />
            </div>

            <Link
              href="/myaccount/dashboard"
              className={linkClass("/myaccount/dashboard")}
              onClick={() => setDrawerOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/myaccount/diary"
              className={linkClass("/myaccount/diary")}
              onClick={() => setDrawerOpen(false)}
            >
              My Diary
            </Link>
            <Link
              href="/myaccount/profile"
              className={linkClass("/myaccount/profile")}
              onClick={() => setDrawerOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/myaccount/chats"
              className={linkClass("/myaccount/chats")}
              onClick={() => setDrawerOpen(false)}
            >
              Chats
            </Link>

            <Link
              href="/myaccount/invitations"
              className={linkClass("/myaccount/invitations")}
              onClick={() => setDrawerOpen(false)}
            >
              Invitations
            </Link>
            <Link
              href="/myaccount/contribution-requests"
              className={linkClass("/myaccount/contribution-requests")}
            >
              Contribution Requests
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default MyAccountHeader;
