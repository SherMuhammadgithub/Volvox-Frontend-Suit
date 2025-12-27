"use client";
import React from "react";
import { Button, Chip, Tooltip } from "@heroui/react";
import { addToast } from "@heroui/toast";
import ReactMarkdown from "react-markdown";
import {
  downloadMarkdownAsPdf,
  markdownToPdfBlob,
} from "@/utils/markdownToPdf";
import { addResearchWork } from "@/api/research";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowDownTrayIcon,
  BookmarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@heroui/skeleton";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SaveSummaryModal from "./SaveSummaryModal";

interface SummaryPanelProps {
  loading: boolean;
  summary: string;
  onClear?: () => void;
}

export default function SummaryPanel({
  loading,
  summary,
  onClear,
}: SummaryPanelProps) {
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const authToken = useAuthStore((s) => s.token);

  const handleSaveSummary = async (researchName: string) => {
    if (!authToken) return;
    setSaving(true);
    try {
      // Convert markdown summary to PDF Blob
      const pdfBlob = await markdownToPdfBlob(summary);
      // Call addResearchWork API
      await addResearchWork({
        researchName,
        file: new File([pdfBlob], `${researchName}.pdf`, {
          type: "application/pdf",
        }),
        authToken,
      });

      addToast({
        title: "Success",
        description: "Summary saved successfully.",
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err?.response?.data?.detail || "Failed to save summary.",
        color: "danger",
      });
    }
    setSaving(false);
    setSaveModalOpen(false);
  };

  const handleDownload = async () => {
    await downloadMarkdownAsPdf(summary, "summary.pdf");
  };

  return (
    <div className="bg-white dark:bg-default-100 rounded-xl border border-default-200 p-8 h-full min-h-[500px] flex flex-col items-center justify-between w-full shadow-sm relative">
      {/* Clear Button at Top Right */}
      {summary && (
        <div className="absolute top-6 right-6">
          <Tooltip content="Clear summary" showArrow={true}>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              size="sm"
              onPress={onClear}
              className="shadow-none"
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
      )}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <DocumentMagnifyingGlassIcon className="w-8 h-8 text-primary-500" />
          <span className="font-bold text-2xl">Summary</span>
          <Chip color="primary" variant="flat" className="ml-2">
            Generated
          </Chip>
        </div>
        <div className="text-sm text-default-500 mb-6">
          Generated content from your selection
        </div>
        {loading ? (
          <div className="w-full flex flex-col items-center gap-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-6 w-2/3 rounded" />
            <Skeleton className="h-6 w-1/2 rounded" />
          </div>
        ) : summary ? (
          <div className="text-base text-default-700 dark:text-default-500 text-center max-w-2xl mb-6 whitespace-pre-line">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-8">
            <DocumentMagnifyingGlassIcon className="w-12 h-12 text-default-300" />
            <div className="font-semibold text-default-700 dark:text-default-300">
              No summary yet
            </div>
            <div className="text-xs text-default-500 dark:text-default-400 text-center">
              Select documents or enter a YouTube URL to generate a summary
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-row gap-4 justify-center mt-8">
        <Tooltip content="Save summary" showArrow={true}>
          <Button
            color="secondary"
            variant="flat"
            startContent={<BookmarkIcon className="w-5 h-5" />}
            onPress={() => setSaveModalOpen(true)}
            isDisabled={loading || !summary}
            className="font-semibold"
          >
            Save
          </Button>
        </Tooltip>
        <Tooltip content="Download summary" showArrow={true}>
          <Button
            color="default"
            variant="flat"
            startContent={<ArrowDownTrayIcon className="w-5 h-5" />}
            onPress={handleDownload}
            isDisabled={loading || !summary}
            className="font-semibold"
          >
            Download
          </Button>
        </Tooltip>
      </div>
      <SaveSummaryModal
        isOpen={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={handleSaveSummary}
        loading={saving}
      />
    </div>
  );
}
