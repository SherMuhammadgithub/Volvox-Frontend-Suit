import { create } from "zustand";
import { addResearchWork, getResearchWorks } from "@/api/research";

interface ResearchWork {
  _id: string;
  user_id: string;
  researchName: string;
  fileName: string;
  extension: string;
  file_id: string;
  createdAt: string;
  fileUrl: string;
}

interface ResearchState {
  loading: boolean;
  error: string | null;
  researchWorks: ResearchWork[];
  addResearch: (params: {
    researchName: string;
    file: File;
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
  async fetchResearchWorks({ limit = 10, offset = 0, search = "", start, end, authToken }) {
    set({ loading: true, error: null });
    try {
      const data = await getResearchWorks({ limit, offset, search, start, end, authToken });
      set({ researchWorks: data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch research works",
      });
    }
  },
}));
