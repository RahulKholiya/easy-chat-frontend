import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";

import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { selectedGroup } = useGroupStore();
  const { authUser, socket } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser && !selectedGroup) return;

    if (selectedUser?._id) {
      getMessages(selectedUser._id, "user");
    }

    if (selectedGroup?._id) {
      getMessages(selectedGroup._id, "group");
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, selectedGroup]);

  useEffect(() => {
    if (selectedGroup?._id && socket) {
      socket.emit("joinGroup", selectedGroup._id);
    }
  }, [selectedGroup, socket]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
  messages.map((message) => {
          
          console.log("SENDER:", message.senderId); 

          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 flex flex-col">
                {selectedGroup && message.senderId && (
                  <span className="text-xs font-semibold text-primary">
                    {typeof message.senderId === "object"
                      ? message.senderId.fullName
                      : "User"}
                  </span>
                )}
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble flex flex-col ${
                  message.isAI ? "bg-purple-500 text-white" : ""
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {message.audio && (
                  <audio controls className="mb-2">
                    <source src={message.audio} type="audio/webm" />
                  </audio>
                )}

                {message.text && (
                  <p>
                    {message.isAI && "🤖 "}
                    {message.text}
                  </p>
                )}
              </div>

              <div ref={messageEndRef}></div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;