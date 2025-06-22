"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Teamapi from "@/components/api/Teamapi";
import { toast } from "react-toastify";
import { IconX } from "@tabler/icons-react";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import { Button, Card, Fileinput, Loadingoverlay, Textinput } from "@nayeshdaggula/tailify";

const Addnewmember = ({ closeAddnewmodal, refreshUserData, openTeamImageModal, closeTeamImageModal, teamImageUrl, croppedImage, teamImageError, setTeamImageError, updateTeamImage, teamImageRemove }) => {
  const access_token = useEmployeDetails((state) => state.access_token);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const updateName = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const updateDesignation = (e) => {
    setDesignation(e.target.value);
    setDesignationError("");
  };

  const [experience, setExperience] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const updateExperience = (e) => {
    let value = e.target.value;
    if (isNaN(value)) {
      return false;
    }
    setExperience(value);
    setExperienceError("");
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    if (!name) {
      setNameError("Name is required");
      setLoading(false);
      return false;
    }
    if (!designation) {
      setDesignationError("Designation is required");
      setLoading(false);
      return false;
    }

    // if (experience === "" && experience <= 0) {
    //   setExperienceError("Experience is required");
    //   setLoading(false);
    //   return false;
    // }

    if (teamImageUrl === "" || teamImageUrl === null) {
      setTeamImageError('Team Image is required');
      setLoading(false);
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("experience", experience);
    formData.append("image", cropedImagefile);

    Teamapi.post("addteammember", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setLoading(false);
          return false;
        }
        toast.success("Team member added successfully!", {
          position: "top-right",
        });
        closeAddnewmodal();
        refreshUserData();
        setLoading(false);
        return false;
      })
      .catch((error) => {
        console.log("Error:", error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setLoading(false);
        return false;
      });
  };

  useEffect(() => {
    if (croppedImage) openTeamImageModal()
  }, [croppedImage])

  return (
    <div className="relative">
      <Card className="w-full" withBorder={false}>
        <Card.Section className="!px-0 !pt-0 border-b border-[#044093]/20">
          <div className="flex justify-between items-center">
            <p className="text-[#044093] text-xl md:text-xl max-sm:text-[17px]">Add New Member</p>
            <Button onClick={closeAddnewmodal} variant="transparent" size="xs" color="#000">
              <IconX size={20} color="#044093" />
            </Button>
          </div>
        </Card.Section>
        <Card.Section className="!px-0 !py-4 border-b border-[#044093]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textinput
              label="Name"
              id="name"
              name="name"
              type="text"
              labelClassName='!font-medium'
              value={name}
              onChange={updateName}
              error={nameError}
              placeholder="Enter Name"
            />
            <Textinput
              label="Designation"
              id="designation"
              name="designation"
              type="text"
              labelClassName='!font-medium'
              value={designation}
              onChange={updateDesignation}
              error={designationError}
              placeholder="Enter Designation"
            />
            <Textinput
              label="Experience"
              id="experience"
              name="experience"
              type="text"
              labelClassName='!font-medium'
              value={experience}
              onChange={updateExperience}
              error={experienceError}
              placeholder="Enter Experience"
            />

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

        <div className="flex justify-end gap-3 mt-3">
          <Button text="Cancel" className="!bg-[#000] hover:bg-red-700 font-normal text-sm" onClick={closeAddnewmodal}>
            Cancel
          </Button>
          <Button disabled={loading} className="bg-[#044093] font-normal text-sm" onClick={handleSubmit}>
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </Card>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={loading} overlayBg="" />
        </div>
      )}
      {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} />}
    </div>
  );
};

export default Addnewmember;
