import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set) => ({
  groups: [],
  selectedGroup: null,

  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch {
      toast.error("Error loading groups");
    }
  },

  createGroup: async (data) => {
    try {
      const res = await axiosInstance.post("/groups", data);
      set((state) => ({
        groups: [...state.groups, res.data],
      }));
      toast.success("Group created");
    } catch {
      toast.error("Create failed");
    }
  },
  updateGroup: async (id, data) => {
  try {
    const res = await axiosInstance.put(`/groups/${id}`, data);

    set((state) => ({
      groups: state.groups.map((g) =>
        g._id === id ? res.data : g
      ),
      selectedGroup: res.data,
    }));

    toast.success("Group updated");
  } catch {
    toast.error("Update failed");
  }
},

  setSelectedGroup: (group) =>
    set({ selectedGroup: group }),
}));