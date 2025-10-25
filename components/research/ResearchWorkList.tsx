"use client";
import { useState } from "react";
import { openOrDownloadFile } from "@/api/research";
import { DateValue, CalendarDate } from "@internationalized/date";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ResearchCard } from "./ResearchCard";
import { Skeleton } from "@heroui/skeleton";
import { DatePicker } from "@heroui/date-picker";
import { Divider } from "@heroui/divider";
import { useAuthStore } from "@/store/authStore";

// Dummy data for now
const dummyResearch = [
  {
    id: 1,
    title: "AI for Healthcare",
    date: new Date("2025-10-01T10:00:00"),
    fileName: "ai-healthcare.pdf",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Quantum Computing Advances",
    date: new Date("2025-10-10T15:30:00"),
    fileName: "quantum.pdf",
    fileUrl: "#",
  },
];

interface ResearchWorkListProps {
  researchWorks?: any[];
  search: string;
  setSearch: (s: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (d: [Date | null, Date | null]) => void;
  loading?: boolean;
  onSearch: () => void;
  onClear: () => void;
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
  const filtered = researchWorks.filter(
    (r) =>
      (r.researchName || r.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!fromDate || new Date(r.createdAt || r.date) >= fromDate) &&
      (!toDate || new Date(r.createdAt || r.date) <= toDate)
  );

  // download file function
  async function handleDownload(fileId: string, mode: "open" | "download") {
    try {
      const authToken = useAuthStore.getState().getAuthToken();
      await openOrDownloadFile(fileId, authToken || "", mode);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  // No sections, just a flat list of documents

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center ">
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
        <Button color="primary" onPress={onSearch} className="md:ml-2">
          Search
        </Button>
        <Button color="secondary" variant="light" onPress={onClear}>
          Clear
        </Button>
      </div>

      {/* use the divider to indicate the difference */}
      <Divider className="my-8" />
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
          filtered.map((r) => (
            <ResearchCard
              key={r._id || r.id}
              research={r}
              onOpen={(fileId) => handleDownload(fileId, "open")}
              onDownload={(fileId) => handleDownload(fileId, "download")}
            />
          ))
        )}
      </div>
    </div>
  );
}
