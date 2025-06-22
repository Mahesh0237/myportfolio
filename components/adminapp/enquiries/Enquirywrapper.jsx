"use client";
import TableLoadingEffect from "@/components/shared/Tableloadingeffect";
import { Drawer, Pagination } from "@nayeshdaggula/tailify";
import { IconEye } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Errorpanel from "@/components/shared/Errorpanel";
import Singleenquiryview from "./Singleenquiryview";
import Enquiryapi from "@/components/api/Enquiryapi";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";

function Enquireswrapper() {
  const access_token = useEmployeDetails((state) => state.access_token);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [enquiresData, setEnquiresData] = useState([]);

  const getEnquiresData = (page) => {
    setIsLoadingEffect(true);
    Enquiryapi.get(`getallenquiries?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            "message": data.message,
            "server_res": data
          }
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return;
        }
        setIsLoadingEffect(false);
        setEnquiresData(data?.data || []);
        setTotalpages(data.totalPages || 1);
        return false;
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
      })
  };

  const onpagechange = (value) => {
    setPage(value);
    getEnquiresData(value);
  };

  useEffect(() => {
    getEnquiresData(page);
  }, []);

  const [enquiryView, setEnquiryView] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const openEnquiryView = (id) => {
    setEnquiryView(true);
    setEnquiryId(id);
  };

  const closeEnquiryView = () => {
    setEnquiryView(false);
    setEnquiryId("");
  };

  return (
    <>
      <p className="text-[#2B2B2B] text-[16px] not-italic font-semibold leading-[18px] py-4 px-3">
        Enquires
      </p>
      <div className="w-full relative overflow-hidden rounded-[4px] border-[0.6px] border-[#979797]/40">
        <table className="w-full text-left border-collapse">
          <thead className="truncate border-b-[0.6px] border-b-[#979797]/40 bg-[#F3F3F3]">
            <tr>
              <th className="px-4 py-3 font-normal">Ref ID</th>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingEffect === false ? (
              enquiresData?.length > 0 ? (
                enquiresData?.map((enquiry, index) => (
                  <tr
                    key={index}
                    className="truncate border-b-[0.6px] border-b-[#979797]/40"
                  >
                    <td
                      className="px-4 py-3 cursor-pointer whitespace-nowrap"
                      onClick={() => openEnquiryView(enquiry.id)}
                    >
                      <p className="text-[12px] font-[500]">
                        {enquiry.uuid || "Guest-User"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-[500]">
                        {enquiry?.name || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-[500]">
                        {enquiry?.email || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-[500]">
                        {enquiry?.mobile || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-[500]">
                        {enquiry?.is_guest ? "Guest" : "User"}
                      </p>
                    </td>
                    <td className="text-center">
                      <div
                        className="flex flex-row items-center justify-center gap-1 cursor-pointer"
                        onClick={() => openEnquiryView(enquiry.id)}
                      >
                        <IconEye stroke={1.5} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-[14px] text-[#4A4D53CC]">
                      No data found
                    </p>
                  </td>
                </tr>
              )
            ) : (
              <TableLoadingEffect colspan={6} tr={10} />
            )}
          </tbody>
        </table>

        <div className="flex justify-end items-end py-4 px-3">
          <Pagination
            totalpages={totalpages}
            value={page}
            onChange={onpagechange}
            activePageClass="!bg-[#044093] text-white"
            color="#044093"
          />
        </div>

        {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}
      </div>

      <Drawer
        padding="5%"
        size={"50%"}
        position="right"
        overlayProps={{ backgroundOpacity: 0.2 }}
        bg={"transparent"}
        zIndex={100}
        open={enquiryView}
        onClose={closeEnquiryView}
        withCloseButton={false}
      >
        {enquiryView && (
          <Singleenquiryview
            closeEnquiryView={closeEnquiryView}
            enquiryId={enquiryId}
          />
        )}
      </Drawer>
    </>
  );
}

export default Enquireswrapper;