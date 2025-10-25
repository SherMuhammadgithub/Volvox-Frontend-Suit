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
        <CardHeader className="flex items-center justify-between gap-2 flex-wrap">
          <h1 className="text-2xl font-bold truncate">Manage Research Work</h1>
          {/* Show icon button on small screens, full button on md+ */}
          <>
            <Button
              color="primary"
              isIconOnly
              className="sm:hidden"
              aria-label="Add Research Work"
              onPress={() => setModalOpen(true)}
            >
              <PlusIcon className="w-6 h-6" />
            </Button>
            <Button
              color="primary"
              className="hidden sm:inline-flex"
              onPress={() => setModalOpen(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Research Work
            </Button>
          </>
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
