import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useGroupStore } from "./useGroupStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  //  GET USERS
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch {
      toast.error("Error loading users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // GET MESSAGES
  getMessages: async (id, type = "user") => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(
        `/messages/${id}?type=${type}`
      );
      const normalized = res.data.map((msg) => ({
        ...msg,
        senderId:
          typeof msg.senderId === "object"
            ? msg.senderId._id
            : msg.senderId,
      }));

      set({ messages: normalized });
    } catch {
      toast.error("Error loading messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //  SEND MESSAGE 
  sendMessage: async (data) => {
    const { selectedUser } = get();
    const selectedGroup = useGroupStore.getState().selectedGroup;

    try {
      const url = `/messages/send/${selectedUser?._id || selectedGroup?._id
        }`;

      await axiosInstance.post(url, {
        ...data,
        groupId: selectedGroup?._id,
      });


    } catch {
      toast.error("Send failed");
    }
  },

  //  SOCKET 
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (msg) => {
      const { selectedUser } = get();
      const selectedGroup =
        useGroupStore.getState().selectedGroup;

      const senderId =
        typeof msg.senderId === "object"
          ? msg.senderId._id
          : msg.senderId;

      const isUserChat =
        selectedUser &&
        (senderId === selectedUser._id ||
          msg.receiverId === selectedUser._id);

      const isGroupChat =
        selectedGroup && msg.groupId === selectedGroup._id;

      if (!isUserChat && !isGroupChat) return;


      const exists = get().messages.some(
        (m) => m._id === msg._id
      );

      if (exists) return;

      const normalizedMsg = {
        ...msg,
        senderId:
          typeof msg.senderId === "object"
            ? msg.senderId._id
            : msg.senderId,
      };

      set({ messages: [...get().messages, normalizedMsg] });
    });
  },

  // ai reply in chat
  aiReply: "",
  setAiReply: (text) => set({ aiReply: text }),
  generateReply: async (lastMessage) => {
  try {
    const res = await axiosInstance.post("/ai", {
      prompt: `Generate a short WhatsApp-style reply to: ${lastMessage}`,
    });

    return res.data.answer; 
  } catch {
    toast.error("AI reply failed");
    return "";
  }
},

  // OCKET unsub
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  // SELECT USER
  setSelectedUser: (user) =>
    set({ selectedUser: user, messages: [] }),
}));