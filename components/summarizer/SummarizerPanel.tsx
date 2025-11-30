"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import {
  PaperClipIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import DocumentSelectorModal from "./DocumentSelectorModal";
import SelectedDocumentList from "./SelectedDocumentList";
import SummaryPanel from "./SummaryPanel";
import { useSummarizeStore } from "@/store/summarizeStore";
import { useAuthStore } from "@/store/authStore";
import { summarizeVideo } from "@/api/summarize";
import { ResearchWork } from "@/types";
import { addToast } from "@heroui/toast";

export default function SummarizerPanel() {
  const handleDeselect = (id: string) => {
    setSelectedDocs((prev) =>
      prev.filter((doc) => String(doc._id || doc.id) !== id)
    );
  };

  const TAB_KEYS = {
    DOCUMENTS: "documents",
    YOUTUBE: "youtube",
  } as const;

  const [tab, setTab] = useState<string>(TAB_KEYS.DOCUMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<ResearchWork[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const authToken = useAuthStore((s) => s.token);
  const { loading, summary, summarize, error, clearSummary } =
    useSummarizeStore();

  const handleSummarize = async () => {
    if (!authToken) return;
    if (tab === TAB_KEYS.DOCUMENTS) {
      if (selectedDocs.length === 0) return;
      const ids = selectedDocs.map((doc) => String(doc._id || doc.id));
      await summarize(ids, authToken);
      addToast({
        title: "Success",
        description: "Documents summarized successfully.",
        color: "success",
      });
    } else if (tab === TAB_KEYS.YOUTUBE) {
      if (!youtubeUrl) return;
      useSummarizeStore.setState({ loading: true, error: null });
      try {
        const result = await summarizeVideo({
          videoUrl: youtubeUrl,
          authToken,
        });

        addToast({
          title: "Success",
          description: "Video summarized successfully.",
          color: "success",
        });
        useSummarizeStore.setState({ summary: result, loading: false });
      } catch (err: any) {
        useSummarizeStore.setState({
          error: err?.message || "Failed to summarize video",
          loading: false,
        });

        addToast({
          title: "Error",
          description: err?.response?.data?.detail || "Please try again.",
          color: "danger",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className="flex justify-center w-full">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
          <div className="flex-shrink-0 w-[370px] sticky top-8 self-start z-10">
            <Tabs
              selectedKey={tab}
              onSelectionChange={(key) => setTab(String(key))}
              className="w-full"
            >
              <Tab key={TAB_KEYS.DOCUMENTS} title="Documents">
                <div className="bg-white dark:bg-default-100 rounded-xl border border-default-200 p-8 flex flex-col gap-4 h-full min-h-[500px] w-full">
                  <div className="font-bold text-lg mb-1">Select Documents</div>
                  <div className="text-sm text-default-500 mb-2">
                    Choose files to summarize
                  </div>
                  <Button
                    color="default"
                    variant="flat"
                    className="w-full mb-3 flex items-center gap-2 justify-center"
                    onPress={() => setModalOpen(true)}
                    startContent={<PaperClipIcon className="w-5 h-5" />}
                  >
                    Attach Document
                  </Button>
                  <SelectedDocumentList
                    selectedDocs={selectedDocs}
                    onDeselect={handleDeselect}
                  />
                  <Button
                    color="secondary"
                    variant="flat"
                    className="w-full flex items-center gap-2 justify-center"
                    disabled={selectedDocs.length === 0}
                    onPress={handleSummarize}
                    startContent={<DocumentTextIcon className="w-5 h-5" />}
                  >
                    Summarize Documents
                  </Button>
                  <DocumentSelectorModal
                    isOpen={modalOpen}
                    onOpenChange={setModalOpen}
                    onSelect={(doc: ResearchWork) => {
                      setSelectedDocs((prev) =>
                        prev.some(
                          (d) => (d._id || d.id) === (doc._id || doc.id)
                        )
                          ? prev
                          : [...prev, doc]
                      );
                      setModalOpen(false);
                    }}
                  />
                </div>
              </Tab>
              <Tab key={TAB_KEYS.YOUTUBE} title="YouTube">
                <div className="bg-white dark:bg-default-100 rounded-xl border border-default-200 p-8 flex flex-col gap-4 h-full min-h-[500px] w-full">
                  <div className="font-bold text-lg mb-1">
                    YouTube Summarizer
                  </div>
                  <div className="text-sm text-default-500 mb-2">
                    Paste a YouTube link to summarize
                  </div>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    startContent={
                      <PlayCircleIcon className="w-5 h-5 text-default-400" />
                    }
                    className="mb-3"
                  />
                  <Button
                    color="secondary"
                    variant="flat"
                    className="w-full flex items-center gap-2 justify-center"
                    disabled={!youtubeUrl}
                    onPress={handleSummarize}
                    startContent={<SparklesIcon className="w-5 h-5" />}
                  >
                    Summarize Video
                  </Button>
                  <div className="bg-default-50 rounded-xl p-4 mt-4 text-sm text-default-700 border border-default-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <SparklesIcon className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-base">
                        Supported Features
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-default-400" />
                        <span>Video transcripts and captions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaperClipIcon className="w-4 h-4 text-default-400" />
                        <span>Multi-language support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PlayCircleIcon className="w-4 h-4 text-default-400" />
                        <span>Timestamp extraction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-default-400" />
                        <span>Key topic identification</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
          <div className="flex-1 flex items-stretch">
            <SummaryPanel
              loading={loading}
              summary={summary}
              onClear={() => clearSummary()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
