import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal";

import { Users, Plus } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const {
    groups,
    getGroups,
    selectedGroup,
    setSelectedGroup,
  } = useGroupStore();

  const { onlineUsers, authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineUsers.includes(u._id))
    : users;

  const onlineCount = onlineUsers.filter(
    (id) => id !== authUser?._id
  ).length;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">

      {/* HEADER */}
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span className="hidden lg:block font-medium">Chats</span>
        </div>

        <button
          className="btn btn-sm btn-primary mt-3 w-full"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Create Group
        </button>

        <div className="hidden lg:flex items-center justify-between mt-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm">Online only</span>
          </label>

          <span className="text-xs text-zinc-500">
            {onlineCount} online
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* GROUPS */}
        <div>
          <b><h3 className="text-xs px-3 text-zinc-400">GROUPS</h3></b>

          {(Array.isArray(groups) ? groups : []).map((group) => (
            <button
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedUser(null);
              }}
              className={`w-full p-3 text-left hover:bg-base-200 ${selectedGroup?._id === group._id
                  ? "bg-base-300"
                  : ""
                }`}
            >
              
              <div className="flex items-center gap-2">
                <img
                  src={group.groupPic || "/group.png"}
                  className="size-8 rounded-full"
                />
                <span>{group.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* USERS */}
        {(Array.isArray(filteredUsers) ? filteredUsers : []).map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setSelectedGroup(null);
              }}
              className={`w-full p-3 flex items-center gap-3 ${isSelected ? "bg-base-300" : "hover:bg-base-200"
                }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  className="size-12 rounded-full"
                />

                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              <div className="hidden lg:block text-left">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-base-content/60">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <CreateGroupModal onClose={() => setShowModal(false)} />
      )}
    </aside>
  );
};

export default Sidebar;