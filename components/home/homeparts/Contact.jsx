"use client";
import Image from "next/image";
import React, { useState } from "react";
import contact_withus from "@/public/assets/contact_withus.png";
import { Button, Textarea, Textinput } from "@nayeshdaggula/tailify";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Enquiryapi from "@/components/api/Enquiryapi";

function Contact() {
  const userInfo = useUserDetails((state) => state.user_info);

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [number, setMobilenumbder] = useState(userInfo?.phone_number || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleSubmit = () => {
    // Reset individual error messages
    setNameError("");
    setEmailError("");
    setMessageError("");

    let isValid = true;

    if (!name.trim()) {
      setNameError("Full Name is required");
      isValid = false;
    }
    if (!email.trim()) {
      setEmailError("Email Address is required");
      isValid = false;
    }
    if (!message.trim()) {
      setMessageError("Message is required");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Please fill the required field.");
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
          toast.error(data.message);
          return;
        }

        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMobilenumbder("");
        setMessage("");
      })
      .catch((error) => {
        const serverMessage =
          error.response?.data?.message || "Something went wrong!";
        toast.error(serverMessage);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col md:flex-row px-[3.3vw] pb-[8vh] w-full mx-auto h-fit bg-[#fff] space-x-[1vw]">
      <div className="w-full md:basis-[61%] rounded-lg">
        <Image
          src={contact_withus}
          alt="contact_withus"
          className="h-full w-full"
        />
      </div>
      <div className="w-full md:basis-[39%] bg-[#F4F4F4] p-[3%] rounded-lg space-y-[1.8vh]">
        <p className="text-[20px] md:text-[32px] 2xl:text-[36px] 3xl:text-[40px] 4xl:text-[48px] text-[#2B2B2B] font-manrope font-[800] leading-tight">
          Let's get in touch
        </p>
        <p className="text-[#2B2B2B]/60 font-manrope text-[12px] md:text-[16px] 2xl:text-[20px] 3xl:text-[22px] 4xl:text-[26px] font-[500]">
          Unveiling the passion, purpose, and heart behind everything we do.
        </p>
        <div className="flex flex-col space-y-[1.8vh] pt-4">
          <Textinput
            label="Full Name"
            labelClassName="text-[#000] font-[500] text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px]"
            placeholder="Enter Full Name"
            inputClassName="h-9 2xl:h-15 pl-3 rounded-sm border border-[#2b2b2b]/60 text-[13px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px] w-full focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            withAsterisk
          />
          <Textinput
            label="Email Address"
            labelClassName="text-[#000] font-[500] text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px]"
            placeholder="Enter Email Address"
            inputClassName="h-9 2xl:h-15 pl-3 rounded-sm border border-[#2b2b2b]/60 text-[13px] w-full focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            withAsterisk
          />
          <Textinput
            label="Mobile Number"
            placeholder="Mobile Number (optional)"
            value={number}
            onChange={(e) => setMobilenumbder(e.target.value)}
            labelClassName="text-[#000] font-[500] text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px]"
            inputClassName="h-9 2xl:h-15 pl-3 rounded-sm border border-[#2b2b2b]/60 text-[13px] w-full focus:outline-none"
          />
          <Textarea
            label="Message"
            labelClassName="text-[#000] font-[500] text-[14px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[24px]"
            placeholder="Message"
            textareaClassName="h-24 2xl:h-36 pl-3 pt-2 rounded-sm border border-[#2b2b2b]/60 text-[13px] w-full focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={messageError}
            withAsterisk
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="!w-full md:!w-fit !h-11 md:!h-fit font-inter font-[500] !text-[16px] md:!text-[14px] 2xl:!text-[15px] 3xl:!text-[16px] 4xl:!text-[17px] !bg-[#044093] hover:!text-[#fff] !px-[1.5vw] !py-[0.5vw] !rounded-[2px] !md:rounded-[5px]">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
