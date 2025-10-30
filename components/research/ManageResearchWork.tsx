"use client";

import { Card, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import ResearchWorkFormModal from "./ResearchWorkFormModal";
import { ResearchWorkList } from "./ResearchWorkList";
import React, { useState } from "react";
import { useResearchStore } from "@/store/researchStore";
import { useAuthStore } from "@/store/authStore";

export default function ManageResearchWork() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const addResearch = useResearchStore((s) => s.addResearch);
  const fetchResearchWorks = useResearchStore((s) => s.fetchResearchWorks);
  const researchWorks = useResearchStore((s) => s.researchWorks);
  const loading = useResearchStore((s) => s.loading);
  const error = useResearchStore((s) => s.error);
  const authToken = useAuthStore((s) => s.token);

  // fecth research works on initial load
  React.useEffect(() => {
    if (authToken) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [authToken]);

  // Only fetch on explicit search
  const handleSearch = () => {
    if (!authToken) return;
    const start = dateRange[0]?.toISOString();
    const end = dateRange[1]?.toISOString();
    fetchResearchWorks({
      limit: 100,
      offset: 0,
      search,
      start,
      end,
      authToken,
    });
  };

  const handleClear = () => {
    setSearch("");
    setDateRange([null, null]);
    if (!authToken) return;
    fetchResearchWorks({
      limit: 100,
      offset: 0,
      search: "",
      start: undefined,
      end: undefined,
      authToken,
    });
  };

  const handleAddResearchWork = async (title: string, file: File | null) => {
    if (!file || !authToken) return;
    try {
      await addResearch({ researchName: title, file, authToken });
      // Refetch after adding
      handleSearch();
    } catch (e) {
      // error handled in store
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-6">
      <Card className="overflow-x-auto">
        <CardHeader className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-t-lg border-b border-default-200">
          <div className="flex-1 w-full">
            <h1 className="text-xl sm:text-2xl font-bold truncate text-center sm:text-left w-full sm:w-auto">
              Your Research Work
            </h1>
            <p className="text-default-500 text-sm mt-2 max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
              Here you can add, search, and manage all your research documents.
              Use the filters to quickly find research work by title or date,
              and upload new documents to keep your research organized.
            </p>
          </div>
          <Button
            color="primary"
            className="flex items-center gap-2 px-3 py-2 text-base sm:text-sm w-full sm:w-auto justify-center"
            onPress={() => setModalOpen(true)}
            aria-label="Add Research Work"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="inline">Add Research Work</span>
          </Button>
        </CardHeader>
        <div className="p-2 sm:p-4 space-y-6 overflow-x-auto">
          <ResearchWorkFormModal
            isOpen={modalOpen}
            onOpenChange={setModalOpen}
            onSubmit={handleAddResearchWork}
            loading={loading}
            error={error}
          />
          <ResearchWorkList
            researchWorks={researchWorks}
            search={search}
            setSearch={setSearch}
            dateRange={dateRange}
            setDateRange={setDateRange}
            loading={loading}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
      </Card>
    </div>
  );
}
