import React from "react";

const DiaryCardSkeleton = () => {
  return (
    <div className="h-fit w-full space-y-[1vh] animate-pulse">
      <div className="relative h-[220px] w-full bg-gray-200 rounded-md"></div>

      <div className="h-5 bg-gray-200 rounded w-3/4"></div>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-200"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="h-3 bg-gray-200 rounded w-1/3"></div>

      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-24"></div>
    </div>
  );
};

export default DiaryCardSkeleton;
