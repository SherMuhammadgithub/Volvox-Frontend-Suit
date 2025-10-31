"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  researchName: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  researchName,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      addToast({
        title: "Success",
        description: "Research work deleted successfully.",
        color: "success",
      });
      onOpenChange(false);
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err?.response?.data?.detail || "Failed to delete research work.",
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">
                Are you sure you want to delete the research work{" "}
                <span className="font-semibold">"{researchName}"</span>?
              </p>
              <p className="text-sm text-danger">
                This action cannot be undone. The file and all associated data will be permanently removed.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleConfirm}
                isLoading={loading}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}