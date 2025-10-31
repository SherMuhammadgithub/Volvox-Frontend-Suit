import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ResearchWork } from "@/types";

interface ResearchCardProps {
  research: ResearchWork;
  onOpen: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onEdit: (research: ResearchWork) => void;
  onDelete: (researchId: string) => void;
}

export function ResearchCard({
  research,
  onOpen,
  onDownload,
  onEdit,
  onDelete,
}: ResearchCardProps) {
  const ext =
    (research.extension || research.fileType || "").toLowerCase() ||
    (research.fileName || "").split(".").pop()?.toLowerCase() ||
    "";
  const isImage =
    ext.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext);
  // Map file extension to icon image
  const iconMap: Record<string, string> = {
    pdf: "/images/pdf.png",
    doc: "/images/doc.png",
    docx: "/images/doc.png",
    xls: "/images/xls.png",
    xlsx: "/images/xls.png",
    ppt: "/images/ppt.png",
    pptx: "/images/ppt.png",
    txt: "/images/folder.png",
    zip: "/images/folder.png",
    rar: "/images/folder.png",
    csv: "/images/folder.png",
    jpg: "/images/picture.png",
    jpeg: "/images/folder.png",
    png: "/images/picture.png",
    gif: "/images/picture.png",
    mp4: "/images/video.png",
    mp3: "/images/audio.png",
    // add more as needed
  };
  const iconSrc = iconMap[ext] || "/images/folder.png";

  return (
    <Card className="flex flex-col h-full border border-default-200 shadow-none">
      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-default-400 hover:text-default-600"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Research actions">
            <DropdownItem
              key="edit"
              startContent={<PencilIcon className="w-4 h-4" />}
              onPress={() => onEdit(research)}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon className="w-4 h-4" />}
              onPress={() => onDelete(research._id || research.id || "")}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Document Image/Preview */}
      <div className="flex items-center justify-center p-3 pb-0">
        <Image
          src={iconSrc}
          alt={research.fileName}
          width={96}
          height={96}
          className="w-24 h-24 object-cover"
        />
      </div>
      {/* Title */}
      <div className="font-semibold text-base truncate text-center mt-2 px-3">
        {research.researchName || research.title}
      </div>
      {/* Remaining Content */}
      <CardBody className="flex flex-col gap-1 items-center">
        <div className="text-xs text-default-400 truncate w-full text-center">
          {research.fileName}
        </div>
        <div className="text-xs text-default-500 w-full text-center">
          {new Date(research.createdAt || research.date || "").toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          })}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => research.file_id && onOpen(research.file_id)}
            isDisabled={!research.file_id}
          >
            Open
          </Button>
          <Button
            color="secondary"
            variant="flat"
            size="sm"
            onPress={() => research.file_id && onDownload(research.file_id)}
            isDisabled={!research.file_id}
          >
            Download
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
