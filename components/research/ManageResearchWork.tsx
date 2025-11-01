"use client";

import { Card, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import ResearchWorkFormModal from "./ResearchWorkFormModal";
import EditResearchModal from "./EditResearchModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { ResearchWorkList } from "./ResearchWorkList";
import React, { useState, useRef } from "react";
import { useResearchStore } from "@/store/researchStore";
import { useAuthStore } from "@/store/authStore";
import { ResearchWork } from "@/types";

export default function ManageResearchWork() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<ResearchWork | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  
  // Use ref to track if initial fetch has been done
  const hasInitialFetch = useRef(false);

  const addResearch = useResearchStore((s) => s.addResearch);
  const updateResearch = useResearchStore((s) => s.updateResearch);
  const deleteResearch = useResearchStore((s) => s.deleteResearch);
  const fetchResearchWorks = useResearchStore((s) => s.fetchResearchWorks);
  const researchWorks = useResearchStore((s) => s.researchWorks);
  const loading = useResearchStore((s) => s.loading);
  const error = useResearchStore((s) => s.error);
  const authToken = useAuthStore((s) => s.token);

  // fecth research works on initial load
  React.useEffect(() => {
    console.log('🔍 ManageResearchWork useEffect triggered, authToken:', authToken ? 'exists' : 'null', 'hasInitialFetch:', hasInitialFetch.current);
    if (authToken && !hasInitialFetch.current) {
      console.log('📞 Calling handleSearch from useEffect (first time only)');
      hasInitialFetch.current = true;
      handleSearch();
    }
    // eslint-disable-next-line
  }, [authToken]);

  // Only fetch on explicit search
  const handleSearch = () => {
    console.log('📞 handleSearch called');
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
    await addResearch({ researchName: title, file, authToken });
    // Store will update the array automatically, no need to refetch
  };

  const handleEditResearch = (research: ResearchWork) => {
    setSelectedResearch(research);
    setEditModalOpen(true);
  };

  const handleUpdateResearch = async (
    researchId: string,
    title: string,
    file?: File
  ) => {
    if (!authToken) return;
    // Mock update for testing (when no real API)
    if (researchId.startsWith("mock-")) {
      console.log("🔄 Mock Update Research:", {
        researchId,
        title,
        fileName: file?.name,
      });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock success - in real app this would update the backend
    } else {
      await updateResearch({
        researchId,
        researchName: title,
        file,
        authToken,
      });
    }
    // Store will update the array automatically, no need to refetch
    setEditModalOpen(false);
    setSelectedResearch(null);
  };

  const handleDeleteResearch = (researchId: string) => {
    const research = researchWorks.find((r) => (r._id || r.id) === researchId);
    if (research) {
      setSelectedResearch(research);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedResearch || !authToken) return;
    const researchId = selectedResearch._id || selectedResearch.id || "";

    // Mock delete for testing (when no real API)
    if (researchId.startsWith("mock-")) {
      console.log("🗑️ Mock Delete Research:", {
        researchId,
        name: selectedResearch.researchName,
      });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock success - in real app this would delete from backend
    } else {
      await deleteResearch({
        researchId,
        authToken,
      });
    }
    // Store will update the array automatically, no need to refetch
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

          <EditResearchModal
            isOpen={editModalOpen}
            onOpenChange={setEditModalOpen}
            research={selectedResearch}
            onSubmit={handleUpdateResearch}
            loading={loading}
            error={error}
          />

          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            researchName={
              selectedResearch?.researchName || selectedResearch?.title || ""
            }
            onConfirm={handleConfirmDelete}
            loading={loading}
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
            onEdit={handleEditResearch}
            onDelete={handleDeleteResearch}
          />
        </div>
      </Card>
    </div>
  );
}
