"use client";
import Enquiryapi from "@/components/api/Enquiryapi";
import Errorpanel from "@/components/shared/Errorpanel";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import { Card, Loadingoverlay } from "@nayeshdaggula/tailify";
import React, { useEffect, useState } from "react";

function Singleenquiryview({ closeEnquiryView, enquiryId }) {
  const access_token = useEmployeDetails((state => state.access_token));
  const [isLoadingEffect, setIsLoadingEffect] = useState(true);
  const [singleEnquiryData, setSingleEnquiryData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchSingleEnquiryData(enquiry_id) {
    Enquiryapi.get("/getsingleenquiry", {
      params: { enquiry_id },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            "message": data.message,
            "server_res": data
          }
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return;
        } else {
          setSingleEnquiryData(data?.singleContact || {});
          setIsLoadingEffect(false);
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            'message': error.message,
            'server_res': error.response.data
          };
        } else {
          finalresponse = {
            'message': error.message,
            'server_res': null
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });
  }

  useEffect(() => {
    if (enquiryId) fetchSingleEnquiryData(enquiryId);
  }, [enquiryId]);

  return (
    <div className="relative">
      <Card className="w-full p-0 relative" padding="0px">
        <Card.Section className="fixed w-full flex justify-between items-center">
          <p className="text-[18px] text-[#044093] font-semibold">Enquiry Details</p>
          <button
            onClick={closeEnquiryView}
            className="cursor-pointer p-0 text-[#044093] bg-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                stroke="#2B2B2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Card.Section>
        <Card.Section className="p-0 top-[50px] fixed w-full">
          <div className="flex flex-col justify-start items-start gap-4 py-4">
            <div className="flex flex-col justify-start items-start gap-2">
              <p className="text-sm text-[#2b2b2b] font-semibold">Name</p>
              <p className="text-sm">{singleEnquiryData?.name}</p>
            </div>

            <div className="flex flex-col justify-start items-start gap-2">
              <p className="text-sm text-[#2b2b2b] font-semibold">Email</p>
              <p className="text-sm">{singleEnquiryData?.email}</p>
            </div>

            <div className="flex flex-col justify-start items-start gap-2">
              <p className="text-sm text-[#2b2b2b] font-semibold">Mobile</p>
              <p className="text-sm">{singleEnquiryData?.mobile}</p>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 pb-2">
              <p className="text-sm text-[#2b2b2b] font-semibold">Status</p>
              <p className="text-sm">
                {singleEnquiryData?.is_guest ? "Guest" : "User"}
              </p>
            </div>

            <div className="flex flex-col justify-start items-start gap-2">
              <p className="text-sm text-[#2b2b2b] font-semibold">Message</p>
              <p className="text-sm">{singleEnquiryData?.message}</p>
            </div>
          </div>
        </Card.Section>
      </Card>
      {
        isLoadingEffect &&
        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
          <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
        </div>
      }
      {errorMessage !== '' && <Errorpanel errorMessages={errorMessage} />}
    </div>
  );
}

export default Singleenquiryview;
