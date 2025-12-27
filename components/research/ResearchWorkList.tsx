"use client";
import { useState } from "react";
import { openOrDownloadFile } from "@/api/research";
import { DateValue, CalendarDate } from "@internationalized/date";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ResearchCard } from "./ResearchCard";
import { useRef } from "react";
import { Skeleton } from "@heroui/skeleton";
import { DatePicker } from "@heroui/react";
import { Divider } from "@heroui/divider";
import { useAuthStore } from "@/store/authStore";
import { ResearchWork } from "@/types";
import { SearchIcon } from "../icons";
import {
  MagnifyingGlassCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ResearchWorkListProps {
  researchWorks?: ResearchWork[];
  search: string;
  setSearch: (s: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (d: [Date | null, Date | null]) => void;
  loading?: boolean;
  onSearch: () => void;
  onClear: () => void;
  onEdit: (research: ResearchWork) => void;
  onDelete: (researchId: string) => void;
  onAdd?: () => void;
}

export function ResearchWorkList({
  researchWorks = [],
  search,
  setSearch,
  dateRange,
  setDateRange,
  loading = false,
  onSearch,
  onClear,
  onEdit,
  onDelete,
  onAdd,
}: ResearchWorkListProps) {
  // Convert JS Date <-> CalendarDate for DatePicker
  function toCalendarDate(d: Date | null): CalendarDate | null {
    if (!d) return null;
    // CalendarDate: year, month, day
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  function toJSDate(d: DateValue | null): Date | null {
    if (!d) return null;
    // DateValue has toDate method
    // @ts-ignore
    return d.toDate ? d.toDate("UTC") : new Date(d.year, d.month - 1, d.day);
  }
  const fromDate = dateRange[0];
  const toDate = dateRange[1];
  // Mock data for testing when no real data is available
  const mockResearchWorks: ResearchWork[] = [];

  // Use mock data if no real research works are available
  const dataToUse =
    researchWorks.length > 0 ? researchWorks : mockResearchWorks;

  const filtered = dataToUse.filter((r) => {
    const researchDate = new Date(r.createdAt || r.date || "");
    return (
      (r.researchName || r.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!fromDate || researchDate >= fromDate) &&
      (!toDate || researchDate <= toDate)
    );
  });

  // Per-card loading state
  const [loadingOpenId, setLoadingOpenId] = useState<string | null>(null);
  const [loadingDownloadId, setLoadingDownloadId] = useState<string | null>(
    null
  );

  // download/open file function with loading state
  async function handleDownload(
    fileId: string,
    fileName: string,
    mode: "open" | "download",
    cardId: string
  ) {
    if (mode === "open") setLoadingOpenId(cardId);
    if (mode === "download") setLoadingDownloadId(cardId);
    try {
      const authToken = useAuthStore.getState().getAuthToken();
      await openOrDownloadFile(fileId, authToken || "", mode, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      if (mode === "open") setLoadingOpenId(null);
      if (mode === "download") setLoadingDownloadId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:gap-16 md:items-center ">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:flex-1">
          <Input
            label="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-1/2"
          />
          <DatePicker
            label="From"
            value={toCalendarDate(dateRange[0])}
            onChange={(date) => setDateRange([toJSDate(date), dateRange[1]])}
            className="md:w-1/4"
          />
          <DatePicker
            label="To"
            value={toCalendarDate(dateRange[1])}
            onChange={(date) => setDateRange([dateRange[0], toJSDate(date)])}
            className="md:w-1/4"
          />
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
          <Button
            color="primary"
            variant="solid"
            onPress={onSearch}
            className="flex items-center gap-2 px-3 py-2 text-base sm:text-sm w-full sm:w-auto justify-center"
          >
            <MagnifyingGlassCircleIcon className="w-4 h-4" />
            <span className="inline">Search</span>
          </Button>
          <Button
            color="default"
            variant="flat"
            onPress={onClear}
            className="flex items-center gap-2 px-3 py-2 text-base sm:text-sm w-full sm:w-auto justify-center"
          >
            <XMarkIcon className="w-4 h-4" />
            <span className="inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* use the divider to indicate the difference */}
      <Divider className="my-4" />

      <div className="flex justify-end mb-4">
        <Button
          color="primary"
          className="flex items-center gap-2 px-3 py-2 text-base sm:text-sm w-full sm:w-auto justify-center"
          onPress={onAdd}
          aria-label="Add Research Work"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="inline">Add Research Work</span>
        </Button>
      </div>

      {/* Flat grid of document cards, no sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-full shadow-none rounded-lg p-4"
            >
              <Skeleton className="w-24 h-24 mx-auto mb-4 rounded " />
              <Skeleton className="h-4 w-3/4 mx-auto mb-2 rounded" />
              <Skeleton className="h-3 w-1/2 mx-auto mb-2 rounded" />
              <Skeleton className="h-3 w-1/3 mx-auto mb-4 rounded" />
              <div className="flex gap-2 justify-center">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-default-400 col-span-full">
            No documents uploaded.
          </div>
        ) : (
          filtered.map((r) => {
            const cardId: string = (r._id || r.id) ?? "";
            return (
              <ResearchCard
                key={cardId}
                research={r}
                onOpen={(fileId: string) =>
                  handleDownload(
                    fileId,
                    r.fileName || "document",
                    "open",
                    cardId
                  )
                }
                onDownload={(fileId: string) =>
                  handleDownload(
                    fileId,
                    r.fileName || "document",
                    "download",
                    cardId
                  )
                }
                onEdit={onEdit}
                onDelete={onDelete}
                loadingOpen={loadingOpenId === cardId}
                loadingDownload={loadingDownloadId === cardId}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
