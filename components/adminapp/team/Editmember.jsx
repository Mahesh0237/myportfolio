"use client";
import Image from "next/image";
import Teamapi from "@/components/api/Teamapi";
import React, { useEffect, useState } from "react";
import Errorpanel from "@/components/shared/Errorpanel";
import { toast } from "react-toastify";
import { IconX } from "@tabler/icons-react";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import { Button, Card, Fileinput, Loadingoverlay, Select, Textinput } from "@nayeshdaggula/tailify";

function Editmember({ closeEditusermodal, singleuserId, refreshUserData, openTeamImageModal, closeTeamImageModal, teamImageUrl, setTeamImageUrl, croppedImage, teamImageError, setTeamImageError, updateTeamImage, teamImageRemove }) {
  const access_token = useEmployeDetails((state) => state.access_token);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const upateFirstName = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const upateDesignation = (e) => {
    setDesignation(e.target.value);
    setDesignationError("");
  };

  const [experience, setExperience] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const upateExperience = (e) => {
    setExperience(e.target.value);
    setExperienceError("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [memberId, setMemberId] = useState('');
  const [memberUuid, setMemberUuid] = useState('');

  const handleSubmit = async () => {
    setIsLoadingEffect(true);

    if (firstName === "") {
      setFirstNameError("Name is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (designation === "") {
      setDesignationError("Designation is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (experience === "") {
      setExperienceError("Experience is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (teamImageUrl === "" || teamImageUrl === null) {
      setTeamImageError('Team Image is required');
      setIsLoadingEffect(false);
      return false;
    }

    let cropedImagefile = null;
    if (teamImageUrl) {
      const response = await fetch(teamImageUrl);
      const blob = await response.blob();
      const randomNum = Math.floor(Math.random() * 1000000);
      const fileExtension = blob.type.split('/')[1];
      const randomFileName = `cropped-image-${randomNum}.${fileExtension}`;

      cropedImagefile = new File([blob], randomFileName, { type: blob.type });
    }

    console.log("cropedImagefile:", cropedImagefile)

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("designation", designation);
    formData.append("experience", experience);
    formData.append("uuid", memberUuid);
    formData.append("id", memberId);

    // append the file
    if (cropedImagefile) {
      formData.append("image", cropedImagefile);
    }

    Teamapi.post("updateteammember", formData, {
      headers: {
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${access_token}`,
      }
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          setErrorMessage({
            message: data.message,
            server_res: data,
          });
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Team member updated successfully!", {
          position: "top-right",
        });
        setIsLoadingEffect(false);
        closeEditusermodal();
        refreshUserData();
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
  };


  async function getSingleTeamMemberData(memberId) {
    Teamapi.post("getsingleteammember", {
      single_member_id: memberId,
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }

        if (data !== null) {
          setFirstName(data?.data?.name || "");
          setDesignation(data?.data?.designation || "");
          setExperience(data?.data?.experience || "");
          setMemberId(data?.data?.id || "");
          setMemberUuid(data?.data?.uuid || "");
          setTeamImageUrl(data?.data?.profile_image_url || "");
        }
        setIsLoadingEffect(false);
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
      });
  }

  useEffect(() => {
    setIsLoadingEffect(true);
    getSingleTeamMemberData(singleuserId);
  }, [singleuserId]);


  useEffect(() => {
    if (croppedImage) openTeamImageModal()
  }, [croppedImage])

  return (
    <div className="relative">
      <Card withBorder={false}>
        <Card.Section className="!px-0 !pt-0">
          <div className="flex justify-between items-center">
            <p className="text-[#044093] text-[17px] max-sm:text-[17px] md:text-xl">
              Update User
            </p>
            <Button
              onClick={closeEditusermodal}
              variant="transparent"
              className="!px-0 focus:outline-none border-none "
            >
              <IconX size={20} color="#044093" />
            </Button>
          </div>
        </Card.Section>
        <Card.Section withBorder className="!px-0 !border-b border-[#044093]/20">
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Textinput
                placeholder="Enter Full Name"
                inputClassName="focus:ring-0 focus:border-[#00AEEF] focus:outline-none"
                label="Name"
                labelClassName="text-sm font-medium font-sans"
                error={firstNameError}
                value={firstName}
                onChange={upateFirstName}
              />
            </div>
            <div>
              <Textinput
                placeholder="Enter Designation"
                label="Designation"
                inputClassName="focus:ring-0 focus:border-[#00AEEF] focus:outline-none"
                labelClassName=" text-sm font-medium font-sans"
                w="50%"
                error={designationError}
                value={designation}
                onChange={upateDesignation}
              />
            </div>
            <div>
              <Textinput
                placeholder="Enter Experience"
                label="Experience"
                inputClassName="focus:ring-0 focus:border-[#00AEEF] focus:outline-none"
                labelClassName=" text-sm font-medium font-sans"
                w="50%"
                error={experienceError}
                value={experience}
                onChange={upateExperience}
              />
            </div>


            {teamImageUrl ? (
              <div className="w-[100%] h-full relative">
                <h1 className="text-sm !font-bold font-sans mb-2">
                  Featured Image
                </h1>
                <div className="w-[100%] min-h-70 relative border border-gray-300 rounded-md overflow-hidden">
                  <Image
                    src={teamImageUrl}
                    alt="Preview"
                    fill
                    className="object-contain object-center"
                  />
                </div>
                <Button
                  onClick={teamImageRemove}
                  className="absolute top-2 right-2 bg-red-500 text-xs text-white stroke-2 !p-1 !rounded-full"
                >
                  <IconX size={10} strokeWidth={2} color='#fff' />
                </Button>
              </div>

            ) : (
              <Fileinput
                label="Featured Image"
                accept="image/*"
                labelClassName="text-sm !font-bold font-sans !text-[#000] 2xl:text-[26px] 2xl:!font-semibold"
                multiple={false}
                value={croppedImage}
                error={teamImageError}
                clearable
                onChange={updateTeamImage}
                className="border p-2 rounded-md w-full 2xl:py-3 2xl:text-[22px]"
              />
            )}
          </div>
        </Card.Section>
        <Button
          onClick={handleSubmit}
          disabled={isLoadingEffect}
          className="!flex !ml-auto !px-6 !text-[14px] !bg-[#044093] !font-normal !text-white !py-2 mt-3"
        >
          Update
        </Button>
      </Card>
      {
        isLoadingEffect &&
        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
          <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
        </div>
      }
      {
        errorMessage !== "" &&
        <Errorpanel
          errorMessages={errorMessage}
        />
      }
    </div>
  );
}

export default Editmember;
