// "use client";
// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import dayjs from "dayjs";

// function Latestpostsdairiescard({
//   posterimage,
//   title,
//   authorimage,
//   authorname,
//   posteddate,
//   description,
//   href,
// }) {
//   return (
//     <div className="h-fit w-full space-y-[1vh] border-[1px] border-[#2B2B2B]/10 !rounded-tl-sm !rounded-tr-sm bg-white shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 md:mb-0">
//       <div className="relative h-[220px] 2xl:h-[320px] 4xl:h-[420px] w-full overflow-hidden !rounded-tl-sm !rounded-tr-sm">
//         <Image
//           src={posterimage}
//           alt="Poster image"
//           className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//           fill
//         />
//       </div>

//       <p className="gap-2 px-2 text-[#2B2B2B] text-[16px] md:text-[16px] 2xl:text-[20px] 3xl:text-[24px] 4xl:text-[32px] font-[700] capitalize">
//         {title}
//       </p>
//       <div className="flex items-center justify-start gap-2 px-2">
//         <Image
//           src={authorimage}
//           alt="Author image"
//           className="w-7 h-7 xl:w-9 xl:h-9 3xl:w-14 3xl:h-14 4xl:w-14 4xl:h-14 object-cover rounded-full  border-[0.6px] border-[#000]"
//           width={40}
//           height={40}
//         />
//         <div className="flex flex-row items-center justify-between gap-2">
//           <p className="text-[#2B2B2B] text-[14px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600]">
//             {authorname}
//           </p>
//           <p className="text-[#2B2B2B] text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[600] xl:ml-8">
//             {dayjs(posteddate).format("MMM DD, YYYY")}
//           </p>
//         </div>
//       </div>
//       <div className="flex flex-col px-2 pb-2">
//         {/* <p className="px-2 text-[#2B2B2B]/60 text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[500] truncate max-w-3xl line-clamp-1" dangerouslySetInnerHTML={{ __html: description }} /> */}
//         {description &&
//           <p className="text-black/60 text-[14px]">
//             {
//               description
//                 .replace(/<img[^>]*>/g, '') // remove <img> tags
//                 .replace(/<\/?[^>]+(>|$)/g, '') // remove all other HTML tags
//                 .split(/\s+/) // split into words
//                 .slice(0, 15)
//                 .join(' ') +
//               (description.replace(/<img[^>]*>/g, '').replace(/<\/?[^>]+(>|$)/g, '').split(/\s+/).length > 15 ? '...' : '')
//             }
//           </p>
//         }
//         <Link href={href || `#`} className="!rounded-md py-2 mt-2 !w-full font-inter font-[500] text-[13px] 2xl:text-[24px] 2xl:py-3 md:text-[14px]  !text-[#fff] !bg-[#044093] border-b-[1px] flex justify-around">
//           View Diary
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Latestpostsdairiescard;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

function Latestpostsdairiescard({
  posterimage,
  title,
  authorimage,
  authorname,
  posteddate,
  description,
  href,
}) {
  return (
    <div className="h-full w-full flex flex-col border-[1px] border-[#2B2B2B]/10 rounded-tl-sm rounded-tr-sm bg-white shadow-sm transition-shadow duration-300">
      {/* Image section - fixed height */}
      <div className="relative h-[200px] 2xl:h-[320px] 4xl:h-[420px] w-full overflow-hidden rounded-tl-sm rounded-tr-sm">
        <Image
          src={posterimage}
          alt="Poster image"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          fill
        />
      </div>

      {/* Content section - flex-grow to take remaining space */}
      <div className="flex-grow flex flex-col p-2">
        {/* Title - fixed line */}
        <p className="text-[#2B2B2B] text-[16px] md:text-[16px] 2xl:text-[20px] 3xl:text-[24px] 4xl:text-[32px] font-[700] capitalize mb-2 line-clamp-1">
          {title}
        </p>

        {/* Author info - fixed height */}
        <div className="flex items-center justify-start gap-2 mb-2">
          <Image
            src={authorimage}
            alt="Author image"
            className="w-7 h-7 xl:w-9 xl:h-9 3xl:w-14 3xl:h-14 4xl:w-14 4xl:h-14 object-cover rounded-full border-[0.6px] border-[#000]"
            width={40}
            height={40}
          />
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            <p className="text-[#2B2B2B] text-[14px] md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] 4xl:text-[28px] font-[600] line-clamp-1">
              {authorname}
            </p>
            <p className="text-[#2B2B2B] text-[12px] md:text-[12px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-[26px] font-[600] xl:ml-8">
              {dayjs(posteddate).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>

        {/* Description - flexible space with min-height */}
        <div className="flex-grow min-h-[60px] mb-2">
          {description && (
            <p className="text-black/60 text-[14px] line-clamp-3">
              {description
                .replace(/<img[^>]*>/g, '')
                .replace(/<\/?[^>]+(>|$)/g, '')
                .split(/\s+/)
                .slice(0, 15)
                .join(' ') +
                (description.replace(/<img[^>]*>/g, '').replace(/<\/?[^>]+(>|$)/g, '').split(/\s+/).length > 15 ? '...' : '')
              }
            </p>
          )}
        </div>

        {/* Button - fixed height */}
        <Link
          href={href || `#`}
          className="rounded-md py-2 w-full font-inter font-[500] text-[13px] 2xl:text-[24px] 2xl:py-3 md:text-[14px] text-[#fff] bg-[#044093] border-b-[1px] text-center"
        >
          View Diary
        </Link>
      </div>
    </div>
  );
}

export default Latestpostsdairiescard;
