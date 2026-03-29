import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  //Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile updated!");
      } catch (err) {
        toast.error("Upload failed");
      }
    };
  };

  return (
    <div className="h-screen pt-16">
      <div className="max-w-2xl mx-auto p-4 py-8">

        <div className="bg-base-100 rounded-xl shadow-lg p-6 space-y-8">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-base-content/60 mt-1">
              Your account details
            </p>
          </div>

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-300"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 
                bg-primary hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <p className="text-sm text-base-content/60">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* USER INFO */}
          <div className="space-y-5">

            {/* NAME */}
            <div>
              <div className="text-sm text-base-content/60 flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <div className="text-sm text-base-content/60 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </div>
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-base-200 rounded-xl p-5">
            <h2 className="text-lg font-medium mb-3">
              Account Information
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt?.split("T")[0] || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span>Status</span>
                <span className="text-green-500 font-medium">
                  Active
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;