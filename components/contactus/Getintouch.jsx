"use client";
import React, { useState } from "react";
import {
  IconArrowRight,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";
import { Button, Textarea, Textinput } from "@nayeshdaggula/tailify";
import { useUserDetails } from "../zustand/useUserDetails";
import Enquiryapi from "../api/Enquiryapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useCompanyinfo } from "../zustand/useCompanyinfo";


function Contactusbanner() {
  const userInfo = useUserDetails((state) => state.user_info);
  const company_info = useCompanyinfo((state) => state.company_info);

  const [error, setError] = useState("");
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [number, setMobilenumbder] = useState(userInfo?.phone_number || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setError(""); // Reset error state

    if (!name || !email || !message) {
      setError("Please fill all the required fields.");
      toast.error("Please fill all the required fields.");
      return;
    }

    setSubmitting(true);

    const enquiryPayload = {
      name,
      email,
      mobile: number,
      message,
      user_id: userInfo?.user_id || null,
      uuid: userInfo?.uuid || null,
    };

    Enquiryapi.post("submitenquiry", enquiryPayload)
      .then((response) => {
        const data = response.data;

        if (data.status === "error") {
          setError(data.message);
          return;
        }

        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMobilenumbder("");
        setMessage("");
        setError("");
      })
      .catch((error) => {
        const serverMessage =
          error.response?.data?.message || "Something went wrong!";
        setError(serverMessage);
        toast.error(serverMessage);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FFFFFF] flex flex-col items-start justify-center">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-6">
            <p className="md:text-[16px] text-[20px] text-black font-[500] 2xl:text-[34px]">
              Get Started
            </p>
            <p className="text-[30px] md:text-[42px] text-black font-semibold md:w-[55%] leading-tight">
              Get in touch with us. We're here to assist you.
            </p>
          </div>
          <div className="flex flex-col items-center md:justify-center justify-between md:gap-6 gap-4">
            <Link href={company_info?.facebook || "#"} target="_blank">
              <div className="border border-[#B7B7B7] rounded-full p-1 md:p-3">
                <IconBrandFacebookFilled size={16} color="black" />
              </div>
            </Link>
            <Link href={company_info?.instagram || "#"} target="_blank">
              <div className="border border-[#B7B7B7] rounded-full p-1 md:p-3">
                <IconBrandInstagram size={16} color="black" />
              </div>
            </Link>
            <Link href={company_info?.twitter || "#"} target="_blank">
              <div className="border border-[#B7B7B7] rounded-full p-1 md:p-3">
                <IconBrandTwitterFilled size={16} color="black" />
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:pt-5 pt-9 w-full">
          <div className="basis-1 md:basis-1/3 max-w-full border-b border-[#CACACA] pb-4">
            <Textinput
              placeholder="Your Name"
              inputClassName="2xl:!text-[26px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!name && error ? "Name is required" : ""}
              withAsterisk
            />
          </div>
          <div className="basis-1 md:basis-1/3 max-w-full border-b border-[#CACACA] pb-4">
            <Textinput
              placeholder="Email Address"
              inputClassName="2xl:!text-[26px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!email && error ? "Email is required" : ""}
              withAsterisk
            />
          </div>
          <div className="basis-1 md:basis-1/3 max-w-full border-b border-[#CACACA] pb-4">
            <Textinput
              placeholder="Mobile Number (optional)"
              inputClassName="2xl:!text-[26px]"
              value={number}
              onChange={(e) => setMobilenumbder(e.target.value)}
            />
          </div>
        </div>
        <div className="basis-1 max-w-full w-full py-8">
          <Textarea
            textareaClassName="2xl:!text-[26px]"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={!message && error ? "Message is required" : ""}
            withAsterisk
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="... bg-[#044093] md:py-3 py-4 2xl:!text-[26px]"
        >
          {submitting ? "Sending..." : "Leave us a Message"}
          {!submitting && <IconArrowRight size={20} />}
        </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Contactusbanner;
