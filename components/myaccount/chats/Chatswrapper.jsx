
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import Chatapi from "@/components/api/Chatapi";
import Socketapi from "@/components/api/Socketapi";
import dummyImage from '@/public/assets/dummy-user-image.png';
import { useSearchParams } from "next/navigation";
import config from "@/config";

const Chatwrapper = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [chatUserList, setChatUserList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const userInfo = useUserDetails((state) => state.user_info);
  const user_id = userInfo?.user_id;
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 630);
      };

      // Initial check
      checkIfMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);

      // Cleanup
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  const getAllChats = async () => {
    try {
      const response = await Chatapi.get("getchatusers", {
        params: { receiver_id: user_id },
      });
      const data = response.data;

      if (data.status === "success") {
        // setChatUserList(data.users);
        const final_data = data?.users || []

        // setChatUserList((prevChatUsers) => {
        //   // Check if userId exists in either final_data (API) or prevChatUsers (current state)
        //   const userExistsInApi = final_data.some((u) => u.id === userId);
        //   const userExistsInPrev = prevChatUsers.some((u) => u.id === userId);

        //   // If user doesn't exist in either, add them
        //   if (!userExistsInApi && !userExistsInPrev) {
        //     return [
        //       ...final_data, // API users
        //       ...prevChatUsers.filter(u => !final_data.some(f => f.id === u.id)), // Existing users not in API
        //       { // Add newSelectedUser if missing
        //         ...newSelectedUser,
        //         lastMessage: "",
        //         timestamp: new Date().toISOString(),
        //         unreadCount: 0,
        //       },
        //     ];
        //   }

        //   // Otherwise, just merge API data with existing state (no duplicates)
        //   return [
        //     ...final_data,
        //     ...prevChatUsers.filter(u => !final_data.some(f => f.id === u.id)),
        //   ];
        // });
        setChatUserList((prevChatUsers) => {
          // Step 1: Merge API data with existing state (avoid duplicates)
          const mergedUsers = [
            ...final_data, // API users (source of truth)
            ...prevChatUsers.filter(
              (user) => !final_data.some((apiUser) => apiUser.id === user.id)
            ), // Existing users not in API
          ];

          // Step 2: Add `newSelectedUser` only if `userId` is valid and not already present
          if (userId && !mergedUsers.some((user) => user.id === userId)) {
            mergedUsers.push({
              id: userId,
              name: userName || "Unknown User",
              profile_image: userImage || dummyImage.src,
              lastMessage: "",
              timestamp: new Date().toISOString(),
              unreadCount: 0,
            });
          }

          return mergedUsers;
        });
      } else {
        console.error("Error fetching chat users:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const currentRoomId = selectedUser
    ? [user_id, selectedUser.id].sort().join("_")
    : null;

  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const userImage = searchParams.get("userImage");

  useEffect(() => {

    // if (userId && !selectedUser) {
    if (userId) {
      const newSelectedUser = {
        id: userId,
        name: userName || "Unknown User",
        profile_image: userImage || dummyImage.src
      };
      setSelectedUser(newSelectedUser);

      if (isMobile) {
        setShowChatWindow(true);
      }

      setChatUserList((prev) => {
        const exists = prev.some((u) => u.id === userId);
        if (!exists) {
          return [
            ...prev,
            {
              ...newSelectedUser,
              lastMessage: "",
              timestamp: new Date().toISOString(),
              unreadCount: 0,
            },
          ];
        }
        return prev;
      });
    }
  }, [searchParams, isMobile]);

  useEffect(() => {
    if (!user_id) return;

    const newSocket = io(config.main_url, {
      query: { userId: user_id },
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: {
        // token: "your-auth-token-if-any",
        userId: user_id,
      },
    });

    setSocket(newSocket);

    newSocket.emit("joinRoomlivelist", { roomId: currentRoomId });
    if (currentRoomId) {
      newSocket.emit("joinRoomlivelist", { roomId: currentRoomId });
    }

    newSocket.on("updateChatList", () => {
      getAllChats();
    });

    newSocket.on("chatListUpdated", (newList) => {
      setChatUserList(newList);
      getAllChats();
    });

    newSocket.on("receiveMessage", async (msg) => {
      setMessages((prev) => [...prev, msg]);
      getAllChats();
    });

    return () => {
      newSocket.off("updateChatList");
      newSocket.disconnect();
    };
  }, [user_id, currentRoomId, selectedUser]);

  useEffect(() => {
    if (user_id) {
      Socketapi.emit("joinRoomlivelist", user_id);
      getAllChats();
    }
  }, [user_id]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setShowChatWindow(true);
    }

    await Chatapi.post("markMessagesAsRead", {
      sender_id: user.id,
      receiver_id: user_id,
    });

    getAllChats();
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
  };

  return (
    <div className="flex md:h-[calc(100vh-135px)] h-[calc(100vh-110px)] overflow-hidden">
      {/* Desktop View */}
      {!isMobile ?
        <>
          <div className="w-[30%] border-r border-gray-300 overflow-y-auto">
            <ChatList
              setSelectedUser={handleSelectUser}
              selectedUser={selectedUser}
              chatUserList={chatUserList}
            />
          </div>
          <div className="w-[70%] overflow-y-auto">
            <ChatWindow
              selectedUser={selectedUser}
              refreshChatList={getAllChats}
              socket={socket}
            />
          </div>
        </>
        :
        <>
          {!showChatWindow ? (
            <div className="w-full overflow-y-auto">
              <ChatList
                setSelectedUser={handleSelectUser}
                selectedUser={selectedUser}
                chatUserList={chatUserList}
              />
            </div>
          ) : (
            <div className="w-full overflow-y-auto">
              <ChatWindow
                selectedUser={selectedUser}
                refreshChatList={getAllChats}
                socket={socket}
                onBack={handleBackToList}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      }

    </div>
  );
};

export default Chatwrapper;