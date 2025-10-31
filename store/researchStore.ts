import { create } from "zustand";
import { addResearchWork, getResearchWorks, updateResearchWork, deleteResearchWork } from "@/api/research";
import { addToast } from "@heroui/toast";
import { ResearchWork } from "@/types";

interface ResearchState {
  loading: boolean;
  error: string | null;
  researchWorks: ResearchWork[];
  addResearch: (params: {
    researchName: string;
    file: File;
    authToken: string;
  }) => Promise<any>;
  updateResearch: (params: {
    researchId: string;
    researchName: string;
    file?: File;
    authToken: string;
  }) => Promise<any>;
  deleteResearch: (params: {
    researchId: string;
    authToken: string;
  }) => Promise<any>;
  fetchResearchWorks: (params: {
    limit?: number;
    offset?: number;
    search?: string;
    start?: string;
    end?: string;
    authToken: string;
  }) => Promise<void>;
}

export const useResearchStore = create<ResearchState>((set) => ({
  loading: false,
  error: null,
  researchWorks: [],
  async addResearch({ researchName, file, authToken }) {
    set({ loading: true, error: null });
    try {
      const data = await addResearchWork({ researchName, file, authToken });
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to add research work",
      });
      throw error;
    }
  },
  async updateResearch({ researchId, researchName, file, authToken }) {
    set({ loading: true, error: null });
    try {
      const data = await updateResearchWork({ researchId, researchName, file, authToken });
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update research work",
      });
      throw error;
    }
  },
  async deleteResearch({ researchId, authToken }) {
    set({ loading: true, error: null });
    try {
      const data = await deleteResearchWork({ researchId, authToken });
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete research work",
      });
      throw error;
    }
  },
  async fetchResearchWorks({
    limit = 10,
    offset = 0,
    search = "",
    start,
    end,
    authToken,
  }) {
    set({ loading: true, error: null });
    try {
      const data = await getResearchWorks({
        limit,
        offset,
        search,
        start,
        end,
        authToken,
      });
      set({ researchWorks: data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch research works",
      });

      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "Please try again.",
        color: "danger",
      });
    }
  },
}));
