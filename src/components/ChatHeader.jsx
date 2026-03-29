import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import { useState } from "react";

import EditGroupModal from "./EditGroupModal";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { onlineUsers } = useAuthStore();

  const [showEdit, setShowEdit] = useState(false);

  const isUserChat = !!selectedUser;

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  return (
    <div className="p-3 border-b border-base-300 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* AVATAR */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img
              src={
                isUserChat
                  ? selectedUser?.profilePic || "/avatar.png"
                  : selectedGroup?.groupPic || "/group.png"
              }
              alt="chat"
            />

            {/* ONLINE DOT */}
            {isUserChat &&
              selectedUser &&
              onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
          </div>
        </div>

        {/* NAMEndSTATUS */}
        <div>
          <div className="flex items-center gap-2">
            
            <h3 className="font-medium">
              {isUserChat
                ? selectedUser?.fullName
                : selectedGroup?.name}
            </h3>

            {/* 🔥 EDIT BUTTON (GROUP ONLY) */}
            {!isUserChat && selectedGroup && (
              <button
                className="btn btn-xs"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </button>
            )}

          </div>

          <p className="text-sm text-base-content/60">
            {isUserChat
              ? selectedUser &&
                onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"
              : `${selectedGroup?.members?.length || 0} members`}
          </p>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button onClick={handleClose}>
        <X />
      </button>

      {/* EDIT  */}
      {showEdit && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;