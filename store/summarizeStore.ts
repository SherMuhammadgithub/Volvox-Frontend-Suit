import { create } from "zustand";
import { summarizeResearch } from "@/api/summarize";

interface SummarizeState {
  loading: boolean;
  error: string | null;
  summary: string;
  summarize: (documentIds: string[], authToken: string) => Promise<void>;
  clearSummary: () => void;
}

export const useSummarizeStore = create<SummarizeState>((set) => ({
  loading: false,
  error: null,
  summary: "",
  summarize: async (documentIds, authToken) => {
    set({ loading: true, error: null });
    try {
      const result = await summarizeResearch({ documentIds, authToken });
      set({ summary: result, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to summarize", loading: false });
    }
  },
  clearSummary: () => set({ summary: "" }),
}));
