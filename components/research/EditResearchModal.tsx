"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ResearchWork } from "@/types";

interface EditResearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  research: ResearchWork | null;
  onSubmit: (researchId: string, title: string, file?: File) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function EditResearchModal({
  isOpen,
  onOpenChange,
  research,
  onSubmit,
  loading = false,
  error = null,
}: EditResearchModalProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

  // Reset form when research changes
  useEffect(() => {
    if (research) {
      setTitle(research.researchName || research.title || "");
      setFile(null);
      setPreviewUrl(null);
      setShowFileInput(false);
    }
  }, [research]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    if (!research) return;
    
    setUpdating(true);
    try {
      // Only pass file if user has selected a new one
      const fileToSend = file ? file : undefined;
      await onSubmit(research._id || research.id || "", title, fileToSend);
      addToast({
        title: "Success",
        description: file 
          ? "Research work and file updated successfully." 
          : "Research title updated successfully.",
        color: "success",
      });
      onClose();
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err?.response?.data?.detail || "Failed to update research work.",
        color: "danger",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setFile(null);
    setPreviewUrl(null);
    setShowFileInput(false);
    onOpenChange(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setShowFileInput(false);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Research Work</ModalHeader>
            <form
              onSubmit={(e) => handleSubmit(e, onClose)}
              className="space-y-4"
            >
              <ModalBody>
                <Input
                  label="Research Title/Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading || updating}
                />
                {!showFileInput && !file && research && (
                  <div className="space-y-2">
                    <div className="text-sm text-default-500 p-3 bg-default-100 rounded-lg flex items-center justify-between">
                      <span>Current file: {research.fileName}</span>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => setShowFileInput(true)}
                      >
                        Change File
                      </Button>
                    </div>
                  </div>
                )}

                {(showFileInput || file) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        label="Choose New File"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        disabled={loading || updating}
                        className="flex-1"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={handleRemoveFile}
                        className="min-w-8 h-8"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    {!file && (
                      <div className="text-xs text-default-400">
                        No file chosen - only title will be updated
                      </div>
                    )}
                  </div>
                )}
                {previewUrl && (
                  <div className="border rounded p-2 bg-default-100">
                    {file?.type.startsWith("image/") ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-40 mx-auto"
                      />
                    ) : file?.type === "application/pdf" ? (
                      <iframe
                        src={previewUrl}
                        className="w-full h-40"
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="text-default-400">
                        No preview available
                      </div>
                    )}
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  variant="light"
                  onPress={onClose}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={updating}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}