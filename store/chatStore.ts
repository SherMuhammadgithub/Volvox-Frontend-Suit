import { create } from "zustand";
import {
  askQuestion,
  getChatHistory,
  getChatById,
  deleteChat,
  Chat,
  ChatDetail,
  ChatMessage,
} from "@/api/chat";
import { addToast } from "@heroui/toast";

interface ChatState {
  loading: boolean;
  loadingChat: boolean;
  error: string | null;
  chats: Chat[];
  currentChat: ChatDetail | null;
  currentChatId: string | null;
  deletingChatId: string | null;

  askQuestion: (params: {
    question: string;
    chatId?: string;
    researchId?: string;
    authToken: string;
  }) => Promise<{ response: string; chat_id: string; chat_title: string }>;

  fetchChatHistory: (params: { authToken: string }) => Promise<void>;

  fetchChatById: (params: {
    chatId: string;
    authToken: string;
  }) => Promise<void>;

  deleteChat: (params: { chatId: string; authToken: string }) => Promise<void>;

  setCurrentChatId: (chatId: string | null) => void;

  startNewChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  loading: false,
  loadingChat: false,
  error: null,
  chats: [],
  currentChat: null,
  currentChatId: null,
  deletingChatId: null,

  askQuestion: async ({ question, chatId, researchId, authToken }) => {
    set({ loading: true, error: null });
    try {
      const data = await askQuestion({
        question,
        chatId,
        researchId,
        authToken,
      });

      // If it's a new chat, add to history
      if (!chatId || chatId !== data.chat_id) {
        const newChat: Chat = {
          chat_id: data.chat_id,
          chat_title: data.chat_title,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: data.chat_id,
        }));
      }

      // Update current chat with new message
      const newMessage: ChatMessage = {
        question,
        response: data.response,
        research_id: researchId || null,
        isNew: true,
      };

      set((state) => ({
        currentChat: state.currentChat
          ? {
              ...state.currentChat,
              messages: [
                ...state.currentChat.messages.map((msg) => ({ ...msg, isNew: false })),
                newMessage,
              ],
            }
          : {
              chat_id: data.chat_id,
              chat_title: data.chat_title,
              createdAt: new Date().toISOString(),
              messages: [newMessage],
            },
        loading: false,
      }));

      return data;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to send message",
      });
      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to send message",
        color: "danger",
      });
      throw error;
    }
  },

  fetchChatHistory: async ({ authToken }) => {
    set({ loading: true, error: null });
    try {
      const data = await getChatHistory({ authToken });
      set({ chats: data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch chat history",
      });
      throw error;
    }
  },

  fetchChatById: async ({ chatId, authToken }) => {
    set({ loadingChat: true, error: null, currentChat: null });
    try {
      const data = await getChatById({ chatId, authToken });
      set({ currentChat: data, currentChatId: chatId, loadingChat: false });
    } catch (error: any) {
      set({
        loadingChat: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch chat",
      });
      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to load chat",
        color: "danger",
      });
      throw error;
    }
  },

  deleteChat: async ({ chatId, authToken }) => {
    set({ deletingChatId: chatId, error: null });
    try {
      await deleteChat({ chatId, authToken });
      set((state) => ({
        chats: state.chats.filter((c) => c.chat_id !== chatId),
        currentChat: state.currentChatId === chatId ? null : state.currentChat,
        currentChatId:
          state.currentChatId === chatId ? null : state.currentChatId,
        deletingChatId: null,
      }));
      addToast({
        title: "Success",
        description: "Chat deleted successfully",
        color: "success",
      });
    } catch (error: any) {
      set({
        deletingChatId: null,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete chat",
      });
      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to delete chat",
        color: "danger",
      });
      throw error;
    }
  },

  setCurrentChatId: (chatId) => {
    set({ currentChatId: chatId, currentChat: null });
  },

  startNewChat: () => {
    set({ currentChatId: null, currentChat: null, loading: false });
  },
}));
