"use client";
import React from "react";
import profilephoto from "@/public/assets/dummy-user-image.png";
const ChatList = ({ setSelectedUser, selectedUser, chatUserList }) => {

// Helper function
const isActiveChat = (user) => {
  return selectedUser?.id === user.id;
};

///////////////////////
  // Sort chat users by timestamp (newest first)
  const sortedChatUsers = [...chatUserList].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="flex flex-col h-full bg-[#fff]">
      <div className="p-4 font-bold text-lg border-b border-gray-300 2xl:text-[32px]">
        Chats
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {sortedChatUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center space-x-4 cursor-pointer p-2 rounded-md hover:bg-gray-200 relative ${
              selectedUser?.id === user.id ? "bg-gray-300" : ""
            }`}
          >
            <img
              src={
                user.profile_image || profilephoto.src
              }
              alt={user.name}
              className="w-10 h-10 rounded-full 2xl:h-18 2xl:w-18"
            />
            <div className="flex flex-col">
              <div className="font-semibold 2xl:text-[28px]">{user.name}</div>
              <div className="text-sm text-gray-500 truncate w-48 2xl:text-[25px]">
                {user.lastMessage || "No messages yet"}
              </div>
              <div className="text-xs text-gray-400 2xl:text-[22px]">
                {user.timestamp
                  ? new Date(user.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>

            {/* ✅ Unread Badge */}
            {user.unreadCount > 0 &&(
              <span className="absolute top-2 right-4 bg-[#044093] text-white text-xs font-bold px-2 py-0.5 2xl:px-4 2xl:py-2 rounded-full  2xl:text-[21px]">
                {user.unreadCount}
              </span>
            )}

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
