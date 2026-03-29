import { useState } from "react";
import { useGroupStore } from "../store/useGroupStore";

const EditGroupModal = ({ group, onClose }) => {
  const { updateGroup } = useGroupStore();

  const [name, setName] = useState(group.name);
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    await updateGroup(group._id, {
      name,
      groupPic: image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 p-5 rounded-lg w-80">

        <h2 className="font-bold mb-3">Edit Group</h2>

        <input
          className="input input-bordered w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input type="file" onChange={handleImage} />

        <div className="flex gap-2 mt-4">
          <button className="btn btn-primary flex-1" onClick={handleUpdate}>
            Update
          </button>

          <button className="btn flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditGroupModal;