"use client";

import ResearchWorkFormModal from "./ResearchWorkFormModal";
import EditResearchModal from "./EditResearchModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { ResearchWorkList } from "./ResearchWorkList";
import React, { useState, useRef, useEffect } from "react";
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
  useEffect(() => {
    if (authToken && !hasInitialFetch.current) {
      hasInitialFetch.current = true;
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    await addResearch({ researchName: title, file, authToken });
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

    await updateResearch({
      researchId,
      researchName: title,
      file,
      authToken,
    });

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

    await deleteResearch({
      researchId,
      authToken,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-6">
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
          onAdd={() => setModalOpen(true)}
        />
      </div>
    </div>
  );
}
