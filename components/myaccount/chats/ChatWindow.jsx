// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Socketapi from "@/components/api/Socketapi";
// import { useUserDetails } from "@/components/zustand/useUserDetails";
// import Chatapi from "@/components/api/Chatapi";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import profilephoto from "@/public/assets/dummy-user-image.png";


// const ChatWindow = ({ selectedUser, refreshChatList ,socket}) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const limit = 10;
//   const scrollRef = useRef(null);
//   const containerRef = useRef(null);
//   const prevScrollHeight = useRef(0);

//   const userInfo = useUserDetails((state) => state.user_info);
//   const myUserId = userInfo?.user_id;
//   const receiverId = selectedUser?.id;




//   useEffect(() => {
//     if (scrollRef.current && page === 1) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const fetchMessages = async (loadMore = false) => {
//     if (!receiverId || !myUserId || (loadMore && !hasMore)) return;

//     setLoading(true);
//     try {
//       const response = await Chatapi.get("getmessagesbetweenusers", {
//         params: {
//           sender_id: myUserId,
//           receiver_id: receiverId,
//           page: loadMore ? page + 1 : 1,
//           limit: limit,
//         },
//       });

//       if (response.data.status === "success") {
//         const newMessages = response.data.messages;
//         setMessages((prev) =>
//           loadMore ? [...newMessages, ...prev] : newMessages
//         );
//         setHasMore(response.data.hasMore);
//         setPage(loadMore ? page + 1 : 1);

//         if (loadMore) {
//           const container = containerRef.current;
//           setTimeout(() => {
//             container.scrollTop =
//               container.scrollHeight - prevScrollHeight.current;
//           }, 0);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleScroll = () => {
//     const container = containerRef.current;
//     if (container) {
//       prevScrollHeight.current = container.scrollHeight;
//       if (container.scrollTop < 100 && hasMore && !loading) {
//         fetchMessages(true);
//       }
//     }
//   };

//   useEffect(() => {
//     if (selectedUser) {

//       ////////////
//       setMessages([]);

//       setPage(1);
//       setHasMore(true);
//       fetchMessages();
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!receiverId || !myUserId) return;

//     const roomId = [myUserId, receiverId].sort().join("_");

//     if (Socketapi.currentRoom && Socketapi.currentRoom !== roomId) {
//       Socketapi.emit("leaveRoom", { roomId: Socketapi.currentRoom });
//     }

//     Socketapi.emit("joinRoom", { senderId: myUserId, receiverId :receiverId });
//     Socketapi.currentRoom = roomId;

//     const handleReceive = (data) => {
//       const formattedMessage = {
//         ...data,
//         timestamp: data.createdAt,
//       };
//       setMessages((prev) => [...prev, formattedMessage]);
//       refreshChatList?.();

//       setTimeout(() => {
//         if (scrollRef.current) {
//           scrollRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 0);
//     };

//     const handleTyping = ({ senderId }) => {
//       if (senderId === receiverId) setIsTyping(true);
//     };

//     const handleStopTyping = ({ senderId }) => {
//       if (senderId === receiverId) setIsTyping(false);
//     };

//     Socketapi.on("receiveMessage", handleReceive);
//     Socketapi.on("messageFrom", ({ senderId, message }) => {
//       // console.log("Direct message from:", senderId, message);
//       refreshChatList();
//     });
//     Socketapi.on("typing", handleTyping);
//     Socketapi.on("stopTyping", handleStopTyping);

//     return () => {
//       Socketapi.off("receiveMessage", handleReceive);
//       Socketapi.off("messageFrom", refreshChatList);
//       Socketapi.off("typing", handleTyping);
//       Socketapi.off("stopTyping", handleStopTyping);
//       Socketapi.emit("leaveRoom", { roomId });
//     };
//   }, [receiverId, myUserId, refreshChatList]);

//   useEffect(() => {
//     const handleMessageStored = (message) => {
//       setMessages((prev) => [...prev, message]);
//       refreshChatList?.();
//     };

//     Socketapi.on("messageStored", handleMessageStored);
//     return () => {
//       Socketapi.off("messageStored", handleMessageStored);
//     };
//   }, [refreshChatList]);

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const msgData = {
//       senderId: myUserId,
//       receiverId,
//       message: newMessage,
//     };

//     Socketapi.emit("sendMessage", msgData);
//     Socketapi.emit("stopTyping", { senderId: myUserId, receiverId });
//     setNewMessage("");
//   };

//   const handleTyping = (e) => {
//     const value = e.target.value;
//     setNewMessage(value);
//     Socketapi.emit(value.trim() ? "typing" : "stopTyping", {
//       senderId: myUserId,
//       receiverId,
//     });
//   };

//   if (!selectedUser) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-gray-500 2xl:text-[29px]">
//         Select a user to start chatting
//         <div className="w-40 h-40 2xl:w-65 2xl:h-65">
//           <DotLottieReact
//             src="https://lottie.host/e3528b10-3c8e-4466-ab62-8d7228708d48/xjq9M2OBPi.lottie"
//             loop
//             autoplay
//           />
//         </div>
//       </div>
//     );
//   }

//   const formatTimestamp = (timestamp) =>
//     new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const formatDateForSeparator = (timestamp) => {
//     const date = new Date(timestamp);
//     const today = new Date();
//     if (date.toDateString() === today.toDateString()) return "Today";
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//     return date.toLocaleDateString();
//   };

//   console.log('from author to ChatWindow : ',selectedUser?.profile_image);

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center p-4 border-b border-gray-300 shadow-sm">
//         <img
//           src={selectedUser?.profile_image || profilephoto.src}
//           alt={selectedUser.name}
//           className="w-10 h-10 rounded-full mr-3 2xl:h-16 2xl:w-16"
//         />
//         <div>
//           <div className="font-semibold text-lg 2xl:text-[30px]">{selectedUser.name}</div>
//           <div className="text-sm text-green-600 2xl:text-[20px]">Online</div>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="flex-1 overflow-y-auto p-4 space-y-3"
//         style={{
//           backgroundImage: "url('/assets/chat-background.png')",
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//         }}
//         onScroll={handleScroll}
//       >
//         {loading && (
//           <div className="text-center text-sm text-gray-500 py-2">
//             Loading older messages...
//           </div>
//         )}

//         {messages.map((msg, index) => {
//           const prevMsg = messages[index - 1];
//           const isDateChanged = prevMsg
//             ? new Date(prevMsg.timestamp).toDateString() !==
//               new Date(msg.timestamp).toDateString()
//             : true;

//           const isMe = msg.senderId === myUserId;

//           return (
//             <React.Fragment key={index}>
//               {isDateChanged && (
//                 <div className="text-center text-xs text-gray-500 py-2 2xl:text-[24px]">
//                   {formatDateForSeparator(msg.timestamp)}
//                 </div>
//               )}

//               <div
//                 className={`relative max-w-[45%] break-words p-2 rounded-lg ${
//                   isMe
//                     ? "ml-auto bg-[#044093] text-white 2xl:text-[26px]"
//                     : "mr-auto bg-[#E4E6EB] text-gray-800 2xl:text-[26px]"
//                 }`}
//               >
//                 <div>{msg.message}</div>
//                 <div className="text-[10px] text-right opacity-70 mt-1 2xl:text-[21px]">
//                   {formatTimestamp(msg.timestamp)}
//                 </div>
//                 <div
//                   className={`absolute top-0 w-0 h-0 border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent ${
//                     isMe
//                       ? "right-[-7px] border-l-[10px] border-l-[#044093] rotate-[-5deg]"
//                       : "left-[-7px] border-r-[10px] border-r-[#E4E6EB] rotate-[5deg]"
//                   }`}
//                 />
//               </div>
//             </React.Fragment>
//           );
//         })}
//         <div ref={scrollRef} />
//       </div>

//       {isTyping && <div className="px-4 text-sm text-gray-500">Typing...</div>}

//       <div className="flex p-4 border-t border-gray-300">
//         <input
//           type="text"
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 2xl:text-[28px]"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           value={newMessage}
//           onChange={handleTyping}
//           placeholder="Type your message..."
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer 2xl:text-[26px] 2xl:px-6"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;























"use client";
import React, { useEffect, useRef, useState } from "react";
import Socketapi from "@/components/api/Socketapi";
import { useUserDetails } from "@/components/zustand/useUserDetails";
import Chatapi from "@/components/api/Chatapi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import profilephoto from "@/public/assets/dummy-user-image.png";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

const ChatWindow = ({ selectedUser, refreshChatList, socket, onBack, isMobile }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  const userInfo = useUserDetails((state) => state.user_info);
  const myUserId = userInfo?.user_id;
  const receiverId = selectedUser?.id;

  useEffect(() => {
    if (scrollRef.current && page === 1) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async (loadMore = false) => {
    if (!receiverId || !myUserId || (loadMore && !hasMore)) return;

    setLoading(true);
    try {
      const response = await Chatapi.get("getmessagesbetweenusers", {
        params: {
          sender_id: myUserId,
          receiver_id: receiverId,
          page: loadMore ? page + 1 : 1,
          limit: limit,
        },
      });

      if (response.data.status === "success") {
        const newMessages = response.data.messages;
        setMessages((prev) =>
          loadMore ? [...newMessages, ...prev] : newMessages
        );
        setHasMore(response.data.hasMore);
        setPage(loadMore ? page + 1 : 1);

        if (loadMore) {
          const container = containerRef.current;
          setTimeout(() => {
            container.scrollTop =
              container.scrollHeight - prevScrollHeight.current;
          }, 0);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      prevScrollHeight.current = container.scrollHeight;
      if (container.scrollTop < 100 && hasMore && !loading) {
        fetchMessages(true);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!receiverId || !myUserId) return;

    const roomId = [myUserId, receiverId].sort().join("_");

    if (Socketapi.currentRoom && Socketapi.currentRoom !== roomId) {
      Socketapi.emit("leaveRoom", { roomId: Socketapi.currentRoom });
    }

    Socketapi.emit("joinRoom", { senderId: myUserId, receiverId });
    Socketapi.currentRoom = roomId;

    const handleReceive = (data) => {
      const formattedMessage = {
        ...data,
        timestamp: data.createdAt,
      };
      setMessages((prev) => [...prev, formattedMessage]);
      refreshChatList?.();

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    };

    const handleTyping = ({ senderId }) => {
      if (senderId === receiverId) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === receiverId) setIsTyping(false);
    };

    Socketapi.on("receiveMessage", handleReceive);
    Socketapi.on("messageFrom", ({ senderId, message }) => {
      refreshChatList();
    });
    Socketapi.on("typing", handleTyping);
    Socketapi.on("stopTyping", handleStopTyping);

    return () => {
      Socketapi.off("receiveMessage", handleReceive);
      Socketapi.off("messageFrom", refreshChatList);
      Socketapi.off("typing", handleTyping);
      Socketapi.off("stopTyping", handleStopTyping);
      Socketapi.emit("leaveRoom", { roomId });
    };
  }, [receiverId, myUserId, refreshChatList]);

  useEffect(() => {
    const handleMessageStored = (message) => {
      setMessages((prev) => [...prev, message]);
      refreshChatList?.();
    };

    Socketapi.on("messageStored", handleMessageStored);
    return () => {
      Socketapi.off("messageStored", handleMessageStored);
    };
  }, [refreshChatList]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msgData = {
      senderId: myUserId,
      receiverId,
      message: newMessage,
    };

    Socketapi.emit("sendMessage", msgData);
    Socketapi.emit("stopTyping", { senderId: myUserId, receiverId });
    setNewMessage("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    Socketapi.emit(value.trim() ? "typing" : "stopTyping", {
      senderId: myUserId,
      receiverId,
    });
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 2xl:text-[29px]">
        Select a user to start chatting
        <div className="w-40 h-40 2xl:w-65 2xl:h-65">
          <DotLottieReact
            src="https://lottie.host/e3528b10-3c8e-4466-ab62-8d7228708d48/xjq9M2OBPi.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateForSeparator = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-300 shadow-sm">
        {isMobile && (
          <button 
            onClick={onBack} 
            className="mr-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            <IconArrowNarrowLeft size={20} />
          </button>
        )}
        <img
          src={selectedUser?.profile_image || profilephoto.src}
          alt={selectedUser.name}
          className="w-10 h-10 rounded-full mr-3 2xl:h-16 2xl:w-16"
        />
        <div>
          <div className="font-semibold text-lg 2xl:text-[30px]">{selectedUser.name}</div>
          <div className="text-sm text-green-600 2xl:text-[20px]">Online</div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          backgroundImage: "url('/assets/chat-background.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        onScroll={handleScroll}
      >
        {loading && (
          <div className="text-center text-sm text-gray-500 py-2">
            Loading older messages...
          </div>
        )}

        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const isDateChanged = prevMsg
            ? new Date(prevMsg.timestamp).toDateString() !==
              new Date(msg.timestamp).toDateString()
            : true;

          const isMe = msg.senderId === myUserId;

          return (
            <React.Fragment key={index}>
              {isDateChanged && (
                <div className="text-center text-xs text-gray-500 py-2 2xl:text-[24px]">
                  {formatDateForSeparator(msg.timestamp)}
                </div>
              )}

              <div
                className={`relative max-w-[45%] break-words p-2 rounded-lg ${
                  isMe
                    ? "ml-auto bg-[#044093] text-white 2xl:text-[26px]"
                    : "mr-auto bg-[#E4E6EB] text-gray-800 2xl:text-[26px]"
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-[10px] text-right opacity-70 mt-1 2xl:text-[21px]">
                  {formatTimestamp(msg.timestamp)}
                </div>
                <div
                  className={`absolute top-0 w-0 h-0 border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent ${
                    isMe
                      ? "right-[-7px] border-l-[10px] border-l-[#044093] rotate-[-5deg]"
                      : "left-[-7px] border-r-[10px] border-r-[#E4E6EB] rotate-[5deg]"
                  }`}
                />
              </div>
            </React.Fragment>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {isTyping && <div className="px-4 text-sm text-gray-500">Typing...</div>}

      <div className="flex md:p-4 p-2 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 2xl:text-[28px]"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer 2xl:text-[26px] 2xl:px-6"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;