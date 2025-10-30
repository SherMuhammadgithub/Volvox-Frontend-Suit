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

  // Reset form when research changes
  useEffect(() => {
    if (research) {
      setTitle(research.researchName || research.title || "");
      setFile(null);
      setPreviewUrl(null);
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
      await onSubmit(research._id || research.id || "", title, file || undefined);
      addToast({
        title: "Success",
        description: "Research work updated successfully.",
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
    onOpenChange(false);
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
                <Input
                  label="New File (Optional - leave empty to keep current file)"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  disabled={loading || updating}
                />
                {research && !file && (
                  <div className="text-sm text-default-500 p-2 bg-default-100 rounded">
                    Current file: {research.fileName}
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