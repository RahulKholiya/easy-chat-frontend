import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

const CreateGroupModal = ({ onClose }) => {
  const { users } = useChatStore();
  const { createGroup } = useGroupStore();

  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedUsers.length === 0) return;

    await createGroup({
      name,
      members: selectedUsers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-5 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">Create Group</h2>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group Name"
          className="input input-bordered w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Users */}
        <div className="space-y-2">
          {users.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                onChange={() => toggleUser(user._id)}
              />
              <span>{user.fullName}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            className="btn btn-primary flex-1"
            onClick={handleCreate}
          >
            Create
          </button>

          <button
            className="btn flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;