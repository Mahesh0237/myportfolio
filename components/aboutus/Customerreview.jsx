"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Customerreviewcard from "./Customerreviewcard";
import customerProfile from "@/public/assets/customer_profile.svg";

function Customerreview() {
  const swiperRef = useRef(null);
  const [activeButton, setActiveButton] = useState("next");

  const updateButton = (direction) => {
    setActiveButton(direction);
  };

  // Array of review objects
  const reviews = [
    {
      id: 1,
      rating: " ⭐️⭐️⭐️⭐️⭐️ ",
      reviewtext:
        "A great little app that some of the big guns have clearly been taking their cue from. Looks like Incomee might actually be cleaner and simpler to use than competitors.",
      customer_profile: customerProfile,
      customer_name: "Test Test",
      customer_desg: "Founder and CEO",
    },
    {
      id: 1,
      rating: " ⭐️⭐️⭐️⭐️⭐️ ",
      reviewtext:
        "A great little app that some of the big guns have clearly been taking their cue from. Looks like Incomee might actually be cleaner and simpler to use than competitors.",
      customer_profile: customerProfile,
      customer_name: "Test Test",
      customer_desg: "Founder and CEO",
    },
    {
      id: 1,
      rating: " ⭐️⭐️⭐️⭐️⭐️ ",
      reviewtext:
        "A great little app that some of the big guns have clearly been taking their cue from. Looks like Incomee might actually be cleaner and simpler to use than competitors.",
      customer_profile: customerProfile,
      customer_name: "Test Test",
      customer_desg: "Founder and CEO",
    },
    {
      id: 1,
      rating: " ⭐️⭐️⭐️⭐️⭐️ ",
      reviewtext:
        "A great little app that some of the big guns have clearly been taking their cue from. Looks like Incomee might actually be cleaner and simpler to use than competitors.",
      customer_profile: customerProfile,
      customer_name: "Test Test",
      customer_desg: "Founder and CEO",
    },
    {
      id: 1,
      rating: " ⭐️⭐️⭐️⭐️⭐️ ",
      reviewtext:
        "A great little app that some of the big guns have clearly been taking their cue from. Looks like Incomee might actually be cleaner and simpler to use than competitors.",
      customer_profile: customerProfile,
      customer_name: "Test Test",
      customer_desg: "Founder and CEO",
    },
  ];

  return (
    <div className="px-[3.3vw] py-[8vh] w-full mx-auto h-fit bg-[#FAFAFA] space-y-[2vh] flex flex-col">
      <div className="flex flex-row justify-between items-start px-3">
        <p className="text-[#2B2B2B] md:font-semibold font-[600] font-manrope text-[18px] md:text-4xl capitalize 2xl:text-[38px]">
          Valuable Words From <span className="block">Customers</span>
        </p>
        <div className="space-x-2">
          <button
            onClick={() => {
              swiperRef.current?.slidePrev();
              updateButton("prev");
            }}
            className={`bg-[#044093] rounded-full p-1 cursor-pointer focus:outline-none ${
              activeButton === "prev" ? "bg-[#044093]" : "bg-[#044093]/40"
            }`}
            aria-label="Previous slide"
          >
            <IconArrowLeft color="#ffffff" className="h-6 w-6 2xl:h-10 2xl:w-10" />
          </button>

          <button
            onClick={() => {
              swiperRef.current?.slideNext();
              updateButton("next");
            }}
            className={`bg-[#044093] rounded-full p-1 focus:outline-none cursor-pointer ${
              activeButton === "next" ? "bg-[#044093]" : "bg-[#044093]/40"
            }`}
            aria-label="Next slide"
          >
            <IconArrowRight color="#ffffff" className="h-6 w-6 2xl:h-10 2xl:w-10" />
          </button>
        </div>
      </div>
      {/* <div className="relative w-full">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={4}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    className="w-full h-full"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {reviews.length !== 0 ? (
                        reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <Customerreviewcard
                                    rating={review.rating}
                                    reviewtext={review.reviewtext}
                                    customer_profile={review.customer_profile}
                                    customer_name={review.customer_name}
                                    customer_desg={review.customer_desg}
                                />
                            </SwiperSlide>
                        ))
                    ) : (
                        <p className="text-[16px] enter">No reviews available</p>
                    )}
                </Swiper>
            </div> */}
      <div className="relative w-full">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1} // Default for mobile
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            // When window width is >= 640px (sm breakpoint)
            640: {
              slidesPerView: 2,
            },
            // When window width is >= 768px (md breakpoint)
            768: {
              slidesPerView: 3,
            },
            // When window width is >= 1024px (lg breakpoint)
            1024: {
              slidesPerView: 4,
            },
          }}
          className="w-full h-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {reviews.length !== 0 ? (
            reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <Customerreviewcard
                  rating={review.rating}
                  reviewtext={review.reviewtext}
                  customer_profile={review.customer_profile}
                  customer_name={review.customer_name}
                  customer_desg={review.customer_desg}
                />
              </SwiperSlide>
            ))
          ) : (
            <p className="text-[16px] enter">No reviews available</p>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Customerreview;
